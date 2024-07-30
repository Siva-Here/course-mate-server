const express = require("express");
const {
  getUserDocs,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserId,
  getAllUsers,
  login,
  exists,
  top10Contributions,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

// router.post("/create",auth,createUser);
router.post("/exists",auth,exists)
router.post("/login",auth,login);
router.get("/contributions",auth,top10Contributions);
// router.get("/users",authAdmin,getAllUsers);
// router.post("/getUserId",auth,getUserId);
// router.get("/docs",auth,getUserDocs);
// router.post("/profile",auth,getUserProfile);
// router.put("/profile",authAdmin,updateUserProfile);
// router.delete("/",authAdmin,deleteUser);
module.exports = router;