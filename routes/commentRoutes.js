const express = require("express");
const { getComments, deleteComment } = require("../controllers/commentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/", auth,getComments);
router.delete("/", authAdmin,deleteComment);

module.exports = router;
