const express = require('express');
const { uploadDoc, createFolder, renameFolder, deleteFolder, getDocs } = require('./yourControllerFile');
const { authMiddleware, authAdminMiddleware } = require('./yourAuthMiddlewareFile');

const router = express.Router();

router.post('/uploadDoc', authMiddleware, uploadDoc);
router.get('/getDocs/:folderId', authMiddleware, getDocs);

router.post('/createFolder', authAdminMiddleware, createFolder);
router.put('/renameFolder', authAdminMiddleware, renameFolder);
router.delete('/deleteFolder/:folderId', authAdminMiddleware, deleteFolder);

module.exports = router;
