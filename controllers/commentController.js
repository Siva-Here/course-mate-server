const mongoose = require('mongoose');
const Comment = require('../model/Comment');

const getComments = async (req, res) => {
    const { docId } = req.params;

    try {
        const comments = await Comment.find({ commentedDocId: docId });
        if (!comments) {
            return res.status(404).json({ message: 'Comments not found' });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getComments, deleteComment };
