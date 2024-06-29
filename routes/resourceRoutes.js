const express = require("express");
const {
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  getResourcesByFolder,
  getResourcesByUser,
  getAllResource,
} = require("../controllers/resourceController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();
router.get("/resources",auth,getAllResource);
router.post("/create",auth, createResource);
router.post("/",auth, getResourceById);
router.put("/",authAdmin,updateResource);
router.delete("/",authAdmin,deleteResource);
router.post("/folder",auth,getResourcesByFolder);
router.post("/user",auth,getResourcesByUser);

module.exports = router;
