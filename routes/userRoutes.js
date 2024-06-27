const express = require("express");
const {
  getUserDocs,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserId,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

router.post("/getUserId",getUserId)
router.get("/docs",getUserDocs);
router.get("/profile",getUserProfile);
router.put("/profile", updateUserProfile);
router.delete("/", deleteUser);
module.exports = router;
