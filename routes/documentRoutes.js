const express = require("express");
const {
  getDocumentsByFolder,
  getDocumentById,
  updateDocument,
  deleteDocument,
  commentOnDocument,
} = require("./documentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.get("/folder/:folderId", auth, getDocumentsByFolder);
router.get("/:docId", auth, getDocumentById);
router.put("/:id", authAdmin, updateDocument);
router.delete("/:id", authAdmin, deleteDocument);
router.post("/comment/:id", auth, commentOnDocument);

module.exports = router;
