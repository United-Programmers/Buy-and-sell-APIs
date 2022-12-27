const Review = require('../models/reviewModel');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('../controllers/handleFactory');

exports.getAllReviews = getAll(Review);

//*This is the middleware product ID & User ID
exports.setProductIdAndUserId = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.prodId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createReview = createOne(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);

