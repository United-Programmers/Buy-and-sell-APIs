const express = require('express');
const { signUp, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo, logout, verify } = require('./../controllers/authController');
const { getAllUsers, updateMe, getUser, deleteUser, getMe, susPendUser, unSusPendUser, getSusPendUser, getNonActive, getUnVerify, geTutorsRouteFunc, getStudentRouteFunc, ApprovedTutor, DeclineTutor } = require('../controllers/userController');
const { uploadUserPhoto, resizeUserPhoto } = require('../controllers/imageController')

const router = express.Router({ mergeParams: true });

//* Get User Management
router.get('/suspended', protect, restrictTo('super-admin', 'admin'), getSusPendUser)
router.get('/non-active', protect, restrictTo('super-admin', 'admin'), getNonActive)
router.get('/non-verify-emails', protect, restrictTo('super-admin', 'admin'), getUnVerify)
router.get('/tutors', protect, restrictTo('super-admin', 'admin'), geTutorsRouteFunc)
router.get('/students', protect, restrictTo('super-admin', 'admin'), getStudentRouteFunc)

router.post('/signUp', signUp);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/verify/:id/:token/', verify);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/me', protect, getMe, getUser)
router.patch('/updateMyPassword', protect, restrictTo('super-admin', 'tutor', 'student', 'admin'), updatePassword);
router.patch('/updateMe', protect, restrictTo('super-admin', 'tutor', 'student', 'admin'),
    uploadUserPhoto,
    resizeUserPhoto,
    updateMe,
);

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