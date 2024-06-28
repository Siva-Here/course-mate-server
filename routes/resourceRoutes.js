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
router.post("/create", createResource);
router.post("/", getResourceById);
router.put("/",updateResource);
router.delete("/",deleteResource);
router.post("/folder",getResourcesByFolder);
router.post("/user",getResourcesByUser);

module.exports = router;
