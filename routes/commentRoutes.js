const express = require("express");
const { getComments, deleteComment } = require("../controllers/commentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/comments/:docId", getComments);
router.delete("/comments/:commentId", deleteComment);

module.exports = router;
