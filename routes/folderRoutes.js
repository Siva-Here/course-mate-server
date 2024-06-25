const express = require("express");
const {
  uploadDoc,
  createFolder,
  renameFolder,
  deleteFolder,
  getDocs,
  getFolderById,
  getSubfolders,
  updateFolder,getFolders
} = require("../controllers/folderController");

const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/uploadDoc",uploadDoc);
router.get("/getDocs", getDocs);

router.post("/createFolder",createFolder);
router.put("/renameFolder", renameFolder);
router.delete("/deleteFolder", deleteFolder);

router.get("/", getFolderById);
router.get("/folders", getFolders);

router.get("/subfolders", getSubfolders);

router.put("/", updateFolder);

module.exports = router;
