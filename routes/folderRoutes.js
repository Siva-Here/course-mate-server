const express = require("express");
const {
  uploadDoc,
  createFolder,
  renameFolder,
  deleteFolder,
  getDocs,
  getFolderById, 
  getSubfolders, 
  updateFolder
} = require("../controllers/folderController");

const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/uploadDoc", authAdmin, uploadDoc);
router.get("/getDocs/:folderId", authAdmin, getDocs);

router.post("/createFolder", authAdmin, createFolder);
router.put("/renameFolder", authAdmin, renameFolder);
router.delete("/deleteFolder/:folderId", authAdmin, deleteFolder);

router.get('/:id', auth, getFolderById);

router.get('/:id/subfolders', auth, getSubfolders);

router.put('/:id', authAdmin, updateFolder);

module.exports = router;
