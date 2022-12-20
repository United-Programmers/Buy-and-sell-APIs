//* UPLOADING MULTIPLE IMAGES

const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');

//* ---UPLOAD MULTIPLE IMAGES---
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadImageDoc = upload.fields([
    { name: 'paySlip', maxCount: 1 },
    { name: 'bankStatement', maxCount: 6 }
]);

exports.resizeImageDoc = catchAsync(async (req, res, next) => {
    if (!req.files.paySlip || !req.files.bankStatement) return next()

    req.body.paySlip = `paySlip-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.paySlip[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/payslip/${req.body.paySlip}`);

    req.body.bankStatement = [];
    await Promise.all(
        req.files.bankStatement.map(async (file, i) => {
            const bankStatement = `bankStatement-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(1000, 900)
                .toFormat('jpeg')
                .jpeg({ quality: 100 })
                .toFile(`public/img/bankStatement/${bankStatement}`);
            req.body.bankStatement.push(bankStatement);
        })
    );
    next();
});

//* ---UPLOAD ONLY ONE IMAGE---
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req?.file) return next();

    if (!req?.user?.id) {
        req.file.photo = `user-${Date.now()}.jpeg`;
    } else {
        req.file.photo = `user-${req?.user?.id}-${Date.now()}.jpeg`;
    }

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/users/${req.file.photo}`);
    next();
});

