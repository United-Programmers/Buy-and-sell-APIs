const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  protect,
  updatePassword,
  restrictTo,
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

router.get("/user/me", protect, getMe, getUser);
router.patch(
  "/user/me/update",
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe
);
router.patch("/updateMyPassword", protect, updatePassword);
router.route("/").get(protect, restrictTo("super-admin"), getAllUsers);
router.route("/:id").get(protect, getUser).delete(protect, deleteUser);
router.post("/:id/suspended", protect, susPendUser);
router.post("/:id/un-suspended", protect, unSusPendUser);
router.post("/:id/approved", protect, ApprovedTutor);
router.post("/:id/decline", protect, DeclineTutor);
router.route("/").get(protect, getAllUsers);
router.route("/user/:id").get(protect, getUser).delete(protect, deleteUser);
router.post("/:id/update-address", updateAddressDetails);

module.exports = router;
