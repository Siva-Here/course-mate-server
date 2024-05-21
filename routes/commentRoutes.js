const express = require("express");
const { getComments, deleteComment } = require("./commentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/comments/:docId", auth, getComments);
router.delete("/comments/:commentId", authAdmin, deleteComment);

module.exports = router;
