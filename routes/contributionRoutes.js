const express = require('express');
const { createContribution, getContribution, updateContribution, deleteContribution, getUserContributions, getDocumentContributions } = require('./contributionController');

const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post('/', auth, createContribution);
router.get('/:id', auth, getContribution);
router.put('/:id', auth, updateContribution);
router.delete('/:id', authAdmin, deleteContribution);
router.get('/user/:userId', auth, getUserContributions);
router.get('/document/:docId', auth, getDocumentContributions);

module.exports = router;
