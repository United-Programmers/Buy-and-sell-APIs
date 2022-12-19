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

//* ---UPLOAD PHOTO---
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    if (!req?.user?.id) {
        req.file.filename = `user-${Date.now()}.jpeg`;
    } else {
        req.file.filename = `user-${req?.user?.id}-${Date.now()}.jpeg`;
    }

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});


//* ---UPLOAD COURSE COVER IMAGE---
exports.uploadCourseImage = upload.single('imageCover');
exports.resizeCourseImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `course-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/courses/${req.file.filename}`);
    next();
});
