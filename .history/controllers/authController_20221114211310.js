require("dotenv").config();
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const Token = require('./../models/token');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { EmailVerify, forgetEmail, ApproveLecturer } = require("../utils/verifyEmail");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (data, statusCode, res, passKey) => {
    const token = signToken(data._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    data.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            data
        }
    });
};

//* PROTECT THE USER NOT TO RESET HIS FORGOTTEN PASSWORD IF HE/SHE HASN'T LOGIN
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        s
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = currentUser;
    next();
});

//* SIGN UP
exports.signUp = catchAsync(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError('User with given email already exist!', 400));

    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        agreed: req.body.agreed,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
    })

    let token = await Token.create({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString("hex"),
    });

    const verifyURL = `${process.env.FRONT_END_URL}verify/${newUser._id}/${token.token}`;

    if (verifyURL) {
        newUser.role === 'tutor' ? null : EmailVerify(verifyURL, newUser)
    }
    createSendToken(newUser, 201, res);
});


//* VERIFY TOKEN 
exports.verify = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(new AppError("Invalid link or the link has expired", 400));

    const token = await Token.findOne({ userId: user._id, myToken: req.params.token });

    if (!token) return next(new AppError("Invalid link or the link has expired", 400));

    const filter = { _id: user._id }
    const updateDocument = { $set: { verified: true } }

    await User.updateOne(filter, updateDocument);
    await Token.findByIdAndRemove(token._id);
    const newUser = await User.findOne({ _id: req.params.id });

    if (!newUser.verified) return next(new AppError("You did not verify your email", 400));

    createSendToken(newUser, 201, res);
});

//* LOGIN
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    if (!user.verified) {
        return next(new AppError('Please Verify your email then try again', 401));
    }
    if (!user.status) {
        return next(new AppError('Sorry this user has been suspended', 401));
    }
    createSendToken(user, 200, res);
});

//*LOGOUT
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email address.', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = `${process.env.FRONT_END_URL}resetPassword/${resetToken}`;
        forgetEmail(resetURL, user.email)
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
    createSendToken(user, 200, res);
});


//* RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined; //remove from the DB
    user.passwordResetExpires = undefined; //remove from the DB
    await user.save();

    createSendToken(user, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};