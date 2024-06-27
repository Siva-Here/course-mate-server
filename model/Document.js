const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  name: { type: String, required: true },  
  parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },  
  avgRating: { type: Number, default: 0 },  
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
  createdAt: { type: Date, default: Date.now },
  rscLink: {type: String, required: false},
  viewLink:{
    type: String, required: true
  },
  downloadLink:{
    type: String, required: true
  },
  fileId: { type: String, required:true}
});


const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
