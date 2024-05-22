const express = require("express");
const {
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByFolder,
  getResourcesByUser,
} = require("../controllers/resourceController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();
router.post("/create",auth, createResource);
router.get("/",auth, getResourceById);
router.put("/", auth,updateResource);
router.delete("/", authAdmin,deleteResource);
router.get("/folder", auth,getResourcesByFolder);
router.get("/user", auth,getResourcesByUser);

module.exports = router;
