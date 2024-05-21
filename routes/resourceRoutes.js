const express = require('express');
const { createResource, getResourceById, updateResource, deleteResource, getResourcesByFolder, getResourcesByUser } = require('./resourceController');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/adminAuth');

const router = express.Router();

router.post('/create', auth, createResource);
router.get('/:id', auth, getResourceById);
router.put('/:id', authAdmin, updateResource);
router.delete('/:id', authAdmin, deleteResource);
router.get('/folder/:folderId', auth, getResourcesByFolder);
router.get('/user/:userId', auth, getResourcesByUser);

module.exports = router;
