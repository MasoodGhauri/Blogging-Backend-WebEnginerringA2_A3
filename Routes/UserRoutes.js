const {
  login,
  verifyAuth,
  verifyAdminAuth,
} = require("../Controllers/AuthController");
const {
  register,
  getUser,
  updateUser,
  blockUser,
  deleteUser,
  followUser,
  unFollowUser,
  unBlockUser,
  allUsers,
} = require("../Controllers/UserController");
const express = require("express");

const router = express.Router();

router.post("/create", register);
router.get("/allusers", allUsers);
router.patch("/", verifyAuth, verifyAdminAuth, updateUser);
router.patch("/block", verifyAuth, verifyAdminAuth, blockUser);
router.patch("/unblock", verifyAuth, verifyAdminAuth, unBlockUser);
router.delete("/:id", verifyAuth, verifyAdminAuth, deleteUser);
router.post("/follow", verifyAuth, followUser);
router.post("/unfollow", verifyAuth, unFollowUser);

router.post("/login", login);
router.get("/:id", getUser);
// router.post("/check", verifyAuth);

module.exports = router;
