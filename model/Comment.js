const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: { type: String, required: true },  
  commentedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  commentedAt: { type: Date, default: Date.now },  
  commentedDocId: { type: Schema.Types.ObjectId, ref: 'Document', required: true }  
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
