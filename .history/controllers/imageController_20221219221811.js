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

exports.uploadImage = upload.fields([
    { name: 'productsImageCover', maxCount: 1 },
    { name: 'productsImages', maxCount: 6 }
]);

exports.resizeImage = catchAsync(async (req, res, next) => {
    if (!req.files.productsImageCover || !req.files.productsImages) return next()

    req.body.productsImageCover = `productsImageCover-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.productsImageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/products/${req.body.productsImageCover}`);

    req.body.productsImages = [];
    await Promise.all(
        req.files.productsImages.map(async (file, i) => {
            const productsImages = `productsImages-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(1000, 900)
                .toFormat('jpeg')
                .jpeg({ quality: 100 })
                .toFile(`public/img/products/${productsImages}`);
            req.body.productsImages.push(productsImages);
        })
    );
    next();
});









//* ---UPLOAD PROFILE PICTURE ---
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