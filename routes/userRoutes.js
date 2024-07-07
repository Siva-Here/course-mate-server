const express = require("express");
const {
  getUserDocs,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserId,
  getAllUsers,
  login,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

// router.post("/create",auth,createUser);
router.get("/login",auth,login);
router.get("/users",auth,getAllUsers);
router.post("/getUserId",auth,getUserId);
router.get("/docs",auth,getUserDocs);
router.post("/profile",auth,getUserProfile);
router.put("/profile",authAdmin,updateUserProfile);
router.delete("/",authAdmin,deleteUser);
module.exports = router;
