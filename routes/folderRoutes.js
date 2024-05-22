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

const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post("/uploadDoc", auth,uploadDoc);
router.get("/getDocs",auth, getDocs);

router.post("/createFolder",authAdmin,createFolder);
router.put("/renameFolder",authAdmin, renameFolder);
router.delete("/deleteFolder",authAdmin, deleteFolder);

router.get("/",auth, getFolderById);

router.get("/subfolders",auth, getSubfolders);

router.put("/",authAdmin, updateFolder);

module.exports = router;
