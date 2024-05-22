const User = require('../model/User');
const Document = require('../model/Document');
const Comment = require('../model/Comment');
const Folder = require('../model/Folder');


const getDocumentsByFolder = async (req, res) => {
    const { folderId } = req.body;

    try {
        const documents = await Document.find({ parentFolder: folderId });
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getDocumentById = async (req, res) => {
    const { docId } = req.body;

    try {
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateDocument = async (req, res) => {
    const { docId, name, rscLink } = req.body;

    try {
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        document.name = name || document.name;
        document.rscLink = rscLink || document.rscLink;
        
        const updatedDocument = await document.save();
        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteDocument = async (req, res) => {
    const { docId } = req.body;

    try {
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        
        const parentFolder = await Folder.findById(document.parentFolder);
        if (parentFolder) {
            parentFolder.contents = parentFolder.contents.filter(docId => docId.toString() !== docId);
            await parentFolder.save();
        }

        await Document.findByIdAndDelete(id);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const commentOnDocument = async (req, res) => {
    const { docId, comment, userEmail } = req.body;

    try {
        const document = await Document.findById(docId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newComment = new Comment({
            comment,
            commentedBy: user._id,
            commentedDocId: docId
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDocumentsByFolder, getDocumentById, updateDocument, deleteDocument, commentOnDocument };
