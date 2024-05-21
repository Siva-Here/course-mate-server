const express = require('express');
const { getDocumentsByFolder, getDocumentById, updateDocument, deleteDocument, commentOnDocument } = require('./documentController');
const { authMiddleware, authAdminMiddleware } = require('./authMiddleware');

const router = express.Router();

router.get('/folder/:folderId', authMiddleware, getDocumentsByFolder);
router.get('/:docId', authMiddleware, getDocumentById);
router.put('/:id', authAdminMiddleware, updateDocument);
router.delete('/:id', authAdminMiddleware, deleteDocument);
router.post('/comment/:id', authMiddleware, commentOnDocument);

module.exports = router;
