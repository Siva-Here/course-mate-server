const express = require('express');
const { uploadDoc, createFolder, renameFolder, deleteFolder, getDocs } = require('./yourControllerFile');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/adminAuth');

const router = express.Router();

router.post('/uploadDoc', authAdmin, uploadDoc);
router.get('/getDocs/:folderId', authAdmin, getDocs);

router.post('/createFolder', authAdmin, createFolder);
router.put('/renameFolder', authAdmin, renameFolder);
router.delete('/deleteFolder/:folderId', authAdmin, deleteFolder);

module.exports = router;
