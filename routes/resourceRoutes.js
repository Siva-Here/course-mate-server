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
router.get("/", getResourceById);
router.put("/", updateResource);
router.delete("/", deleteResource);
router.get("/folder", getResourcesByFolder);
router.get("/user", getResourcesByUser);

module.exports = router;
