const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

//! * UPDATE PRODUCTS STATUS
const responseData = (result, statusCode, res, length) => {
    res.status(statusCode).json({
        status: 'success',
        result: length ? length : 0,
        data: {
            data: result,
        },
    });
}

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.prodId) filter = { tour: req.params.prodId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;
    responseData(products, 200, res, products.length)
});

exports.getMine = Model => catchAsync(async (req, res, next) => {
    const findByUser = { user: req.user.id }
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;
    responseData(products, 200, res, products.length)
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const product = await query;
    if (!product) return next(new AppError('No document found with that ID', 404));
    responseData(product, 200, res)
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const getReqBody = req.body;
    if (req.file) getReqBody.photo = req.file.filename;
    if (req.file) getReqBody.productsImageCover = req.file.filename;
    if (req.file) getReqBody.productsImages = req.file.filename;

    const product = await Model.findByIdAndUpdate(req.params.id, getReqBody, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new AppError('No document found with that ID', 404));
    }
    responseData(product, 200, res)
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const product = await Model.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('No document found with this ID', 404));
    responseData(null, 200, res)
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const getReqBody = req.body;
    if (req.file) {
        getReqBody.imageCover = req.file.filename;
        getReqBody.reviewImages = req.file.filename;
    }
    const product = await Model.create(getReqBody);
    responseData(product, 200, res)
});


// DISABLE, ENABLE, DEACTIVATE ==> PRODUCTS
exports.productsAction = (Model, ActionObject) => catchAsync(async (req, res, next) => {
    const products = await Model.findByIdAndUpdate(req.params.id, ActionObject);
    if (!products) return next(new AppError('No document found with that ID', 404));
    responseData(products, 200, res)
});
//END


// GET PRODUCTS BY USER(SELLER) ID
exports.getBySellerID = (Model) => catchAsync(async (req, res, next) => {
    const products = await Model.find({ Users: req.params.id });
    if (!products) return next(new AppError('No products found with that ID', 404));
    responseData(products, 200, res, products.length)
});
//END























exports.geSuspended = (Model, Status) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ status: Status });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});

exports.getActive = (Model, active) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ active: active });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});

exports.getUnverified = (Model, verify) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ verified: verify });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});

exports.getTutors = (Model, role) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ role: role });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});

exports.getStudents = (Model, role) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ role: role });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});


exports.getBookMarkByUserId = (Model) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ userId: req.params.id });

    const result = users.map(res => {
        // return res.courseId
        return {
            courses: res.courseId,
            ids: res._id,
        }
    })

    res.status(200).json({
        status: 'success',
        results: result.length,
        data: {
            data: result,
        },
    });
});


exports.getCourseByTutorId = (Model) => catchAsync(async (req, res, next) => {
    const users = await Model.find({ Tutor: req.params.id });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users,
        },
    });
});




