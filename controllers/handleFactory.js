const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    });
});

exports.getMine = Model => catchAsync(async (req, res, next) => {
    const findByUser = { user: req.user.id } //u can specify as many obj u can
    const features = new APIFeatures(Model.find(findByUser), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const leaves = await features.query;

    res.status(200).json({
        status: 'success',
        results: leaves.length,
        data: {
            data: leaves,
        },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const getReqBody = req.body;
    if (req.file) getReqBody.photo = req.file.filename;
    if (req.file) getReqBody.imageCover = req.file.filename;

    const doc = await Model.findByIdAndUpdate(req.params.id, getReqBody, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No details found with this ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: null
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const getReqBody = req.body;
    if (req.file) getReqBody.imageCover = req.file.filename;
    const doc = await Model.create(getReqBody);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

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