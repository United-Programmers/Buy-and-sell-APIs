const express = require("express");
const {
  userSignUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
  verify,
} = require("./../controllers/authController");
const {
  getAllUsers,
  updateMe,
  getUser,
  deleteUser,
  getMe,
  susPendUser,
  unSusPendUser,
  ApprovedTutor,
  DeclineTutor,
  updateAddressDetails,
} = require("../controllers/userController");
const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require("../controllers/imageController");

const router = express.Router({ mergeParams: true });

router.post("/user/signUp", userSignUp);

router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/verify/:id/:token/", verify);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/me", protect, getMe, getUser);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, uploadUserPhoto, resizeUserPhoto, updateMe);

router.route("/").get(protect, restrictTo("super-admin"), getAllUsers);
router.route("/:id").get(protect, getUser).delete(protect, deleteUser);

router.post("/:id/suspended", protect, susPendUser);
router.post("/:id/un-suspended", protect, unSusPendUser);
router.post("/:id/approved", protect, ApprovedTutor);
router.post("/:id/decline", protect, DeclineTutor);

router.post("/:id/update-address", updateAddressDetails);

module.exports = router;
