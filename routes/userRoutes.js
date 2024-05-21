const express = require("express");
const {
  getUserDocs,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

router.get("/docs/:email", auth, getUserDocs);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:userId", auth, getUserProfile);
router.put("/profile/:userId", auth, updateUserProfile);
router.delete("/:userId", authAdmin, deleteUser);

module.exports = router;
