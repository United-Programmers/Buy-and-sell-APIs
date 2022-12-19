const express = require('express');
const { signUp, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo, logout, verify } = require('./../controllers/authController');
const { getAllUsers, updateMe, getUser, deleteUser, getMe, susPendUser, unSusPendUser, ApprovedTutor, DeclineTutor } = require('../controllers/userController');
const { uploadUserPhoto, resizeUserPhoto } = require('../controllers/imageController')

const router = express.Router({ mergeParams: true });

router.post('/signUp', signUp);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/verify/:id/:token/', verify);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/me', protect, getMe, getUser)
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe);

//![4] THE ADMIN MANAGING ALL HIS USERS THIS MEANS 
router.route('/').get(protect, restrictTo('super-admin'), getAllUsers)
router
    .route('/:id')
    .get(protect, restrictTo('super-admin'), getUser)
    .delete(protect, restrictTo('super-admin', 'admin'), deleteUser)

router.post('/:id/suspended', protect, restrictTo('super-admin', 'admin'), susPendUser);
router.post('/:id/un-suspended', protect, restrictTo('super-admin', 'admin'), unSusPendUser);
router.post('/:id/approved', protect, restrictTo('super-admin', 'admin'), ApprovedTutor);
router.post('/:id/decline', protect, restrictTo('super-admin', 'admin'), DeclineTutor);

module.exports = router