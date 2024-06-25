const express = require('express');
const { createContribution, getContribution, updateContribution, deleteContribution, getUserContributions, getDocumentContributions } = require('../controllers/contributionController');

const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.post('/', createContribution);
router.get('/:id', getContribution);
router.put('/:id', updateContribution);
router.delete('/:id', deleteContribution);
router.get('/user/:userId', getUserContributions);
router.get('/document/:docId', getDocumentContributions);

module.exports = router;
