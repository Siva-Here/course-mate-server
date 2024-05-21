const express = require("express");
const {
  uploadDoc,
  createFolder,
  renameFolder,
  deleteFolder,
  getDocs,
  getFolderById,
  getSubfolders,
  updateFolder,
} = require("../controllers/folderController");

// const auth = require("../middlewares/auth");
// const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/uploadDoc", uploadDoc);
router.get("/getDocs/:folderId", getDocs);

router.post("/createFolder", createFolder);
router.put("/renameFolder", renameFolder);
router.delete("/deleteFolder", deleteFolder);

router.get("/", getFolderById);

router.get("/subfolders", getSubfolders);

router.put("/:id", updateFolder);

module.exports = router;
