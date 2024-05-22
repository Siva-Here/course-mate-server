const express = require("express");
const {
  getUserDocs,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

router.get("/docs", auth,getUserDocs);
router.get("/profile", auth,getUserProfile);
router.put("/profile",authAdmin, updateUserProfile);
router.delete("/",authAdmin, deleteUser);
module.exports = router;
