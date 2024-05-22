const express = require("express");
const { getComments, deleteComment } = require("../controllers/commentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/", getComments);
router.delete("/", deleteComment);

module.exports = router;
