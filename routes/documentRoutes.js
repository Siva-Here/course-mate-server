const express = require("express");
const {
  getDocumentsByFolder,
  getDocumentById,
  updateDocument,
  deleteDocument,
  commentOnDocument,
} = require("../controllers/documentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/folder", getDocumentsByFolder);
router.get("/", getDocumentById);
router.put("/", updateDocument);
router.delete("/", deleteDocument);
router.post("/comment/", commentOnDocument);

module.exports = router;
