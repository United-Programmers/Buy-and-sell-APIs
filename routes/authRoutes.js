const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  userSignUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  logout,
  verify,
  driverSignup,
  sellerSignup,
  adminSignup,
} = require("./../controllers/authController");
const { getUser, getMe } = require("../controllers/userController");


router.post("/user/signUp", userSignUp);
router.post("/admin/signUp", adminSignup);
router.post("/seller/signUp", sellerSignup);
router.post("/driver/signUp", driverSignup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/verify/:id/:token/", verify);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/user/me", protect, getMe, getUser);

module.exports = router;
