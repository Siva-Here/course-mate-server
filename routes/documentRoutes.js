const express = require("express");
const {
  getDocumentsByFolder,
  getDocumentById,
  updateDocument,
  deleteDocument,
  uploadDocument,
  commentOnDocument,
  saveDocument,
} = require("../controllers/documentController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const router = express.Router();

router.post("/saveDocument",auth,saveDocument);
router.post("/upload", auth,uploadDocument);
router.post("/folder",auth, getDocumentsByFolder);
router.get("/",auth, getDocumentById);
router.put("/",authAdmin,updateDocument);
router.delete("/", authAdmin,deleteDocument);
router.post("/comment",authAdmin,commentOnDocument);
module.exports = router;