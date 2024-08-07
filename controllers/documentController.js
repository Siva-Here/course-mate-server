const User = require("../model/User");
const Document = require("../model/Document");
const Comment = require("../model/Comment");
const Folder = require("../model/Folder");
const Token =require("../model/Token");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { format } = require("date-fns");
const {jwtDecode}=require('jwt-decode');
const { JWT } = require('google-auth-library');
const axios=require('axios');
const {sendFcmMessage} = require('../firebase/sendNotification');
require("dotenv").config();
 
const getRefreshTokenFromDb = async () => {
  try {
    const tokenDoc = await Token.findOne({}).exec();
    console.log(tokenDoc.refreshToken);
    return tokenDoc ? tokenDoc.refreshToken : null;
  } catch (error) {
    console.error("Error retrieving refresh token from database:", error);
    throw error;
  }
};

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// const REFRESH_TOKEN =getRefreshTokenFromDb() || process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


const setupOAuthClient = async () => {
  const refreshToken = await getRefreshTokenFromDb();
  if (refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
  } else {
    console.error("No refresh token found in the database.");
  }
};

setupOAuthClient();

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const currentDate = format(new Date(), "yyyy-MM-dd_HH-mm-ss"); // Format current date and time
    const fileExtension = getFileExtension(file.originalname); // Extract sanitized file extension
    const filename = `${currentDate}.${fileExtension}`; // Combine date and extension
    cb(null, filename);
  },
});

function getFileExtension(filename) {
  const parts = filename.split(".");
  if (parts.length === 1) {
    return parts[0];
  }
  return parts.pop();
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, PPT, PPTX, and DOCX files are allowed."));
    }
  },
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
}).single("file");

const getDocumentsByFolder = async (req, res) => {
  const { folderId } = req.body;

  try {
    const documents = await Document.find({ parentFolder: folderId }).select('-_id'); 
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadDocument = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File is too large. Maximum size allowed is 30MB." });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const uploadDir = "secure_uploads/";
    const securePath = path.join(uploadDir, req.file.filename);

    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.renameSync(req.file.path, securePath);

      // Upload file to Google Drive
      const response = await drive.files.create({
        requestBody: {
          name: req.file.originalname, // Use the original filename from the upload
          parents: ["1ADy6Zj3tNL6RVeljH_mSrSPk4iJp0wQI"],
          mimeType: req.file.mimetype,
        },
        media: {
          mimeType: req.file.mimetype,
          body: fs.createReadStream(securePath),
        },
      });

      const fileId = response.data.id;

      // Generate public URL
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const result = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
      });

      console.log({
        fileId: fileId,
        webViewLink: result.data.webViewLink,
        webContentLink: result.data.webContentLink,
      });

      // Unlink the file from secure_uploads
      fs.unlinkSync(securePath);

      return res.json({
        name: req.file.originalname,
        fileId: fileId,
        viewLink: result.data.webViewLink,
        downloadLink: result.data.webContentLink,
      });
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      
      // Attempt to delete the file from the uploads directory if the upload fails
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({ error: "Failed to upload the file to Google Drive." });
    }
  });
};

const deleteFile = async (fileId) => {
  try {
    const response = await drive.files.delete({
      fileId: fileId,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error.message);
    throw new Error('Failed to delete file from Google Drive');
  }
};

const saveDocument = async (req, res) => {
  const { fileId, name, viewLink, downloadLink, parentFolder, uploadedBy } = req.body;
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(403).json({ message: "Authorization token is required" });
  }

  const bearerToken = bearerHeader.split(' ')[1];

  if (!fileId || !name || !viewLink || !downloadLink || !parentFolder || !uploadedBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const decodedToken = jwtDecode(bearerToken);
    const user = await User.findById(uploadedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User email from database:', user.email);
    console.log('User email from token:', decodedToken.email);

    if (decodedToken.email !== user.email) {
      return res.status(401).json({ message: "User Not Allowed!!!" });
    }

    // Create and save the new document
    const newDocument = new Document({
      name,
      parentFolder,
      uploadedBy,
      viewLink,
      downloadLink,
      fileId
    });

    const savedDocument = await newDocument.save();

    // Retrieve the parent folder
    const parentFolderDoc = await Folder.findById(savedDocument.parentFolder);
    if (!parentFolderDoc) {
      return res.status(404).json({ message: "Parent folder not found" });
    }

    let body = `Document uploaded in ${parentFolderDoc.name}`;
    // Retrieve the parent of the parent folder (grandparent folder)
    const grandParentFolder = await Folder.findById(parentFolderDoc.parentFolder);
    if (grandParentFolder) {
      body += `, under ${grandParentFolder.name} to be acccepted`;
    } else {
      body += ' in GATE';
    }

    // Use both parent and grandparent folder names in the notification body
    const title = newDocument.name;

    // Send notification to all admin users
    const adminUsers = await User.find({ isAdmin: true, token: { $exists: true, $ne: null } });
    const tokens = adminUsers.map(admin => admin.token);
    const success = await sendFcmMessage(tokens, title, body);

    if (success) {
      console.log("Notification sent successfully");
    } else {
      console.log("Failed to send some notifications");
    }

    return res.status(201).json({
      message: "Document saved successfully",
      document: savedDocument
    });
  } catch (error) {
    console.error("Error saving document:", error);
    return res.status(500).json({ error: "Failed to save the document" });
  }
};



const getDocumentById = async (req, res) => {
  const { docId } = req.body;

  try {
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDocument = async (req, res) => {
  const { docId, name, rscLink } = req.body;

  try {
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.name = name || document.name;
    document.rscLink = rscLink || document.rscLink;

    const updatedDocument = await document.save();
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDocument = async (req, res) => {
  const { docId } = req.body;
  try {
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const parentFolder = await Folder.findById(document.parentFolder);
    if (parentFolder) {
      // Ensure all required fields are set
      if (parentFolder.isSubject === undefined) {
        parentFolder.isSubject = false; // or set to an appropriate default value
      }
      if (parentFolder.isSem === undefined) {
        parentFolder.isSem = false; // or set to an appropriate default value
      }

      parentFolder.contents = parentFolder.contents.filter(
        (id) => id.toString() !== docId
      );
      await parentFolder.save();
    }

    const user = await User.findById(document.uploadedBy);
    if (user) {
      user.totalUploaded -= 1; // Decrease total uploaded count
      user.uploadedDocs = user.uploadedDocs.filter(
        (id) => id.toString() !== docId
      );
      await user.save();
    }

    // Delete the file from Google Drive
    await deleteFile(document.fileId);

    // Delete the document from the database
    await Document.findByIdAndDelete(docId);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const commentOnDocument = async (req, res) => {
  const { docId, comment, userId } = req.body;

  try {
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      comment,
      commentedBy: user._id,
      commentedDocId: docId,
    });
    
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptDocument = async (req, res) => {
  const { docId } = req.body;

  try {
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.isAccepted = true;
    await document.save();

    // Increment the totalUploaded count of the user who uploaded the document
    const user = await User.findById(document.uploadedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndUpdate(document.uploadedBy, { $inc: { totalUploaded: 1 } });

    // Retrieve the parent folder
    const parentFolder = await Folder.findById(document.parentFolder);
    if (!parentFolder) {
      return res.status(404).json({ message: "Parent folder not found" });
    }

    let body = `Document uploaded in ${parentFolder.name}`;
    // Retrieve the parent of the parent folder (grandparent folder)
    const grandParentFolder = await Folder.findById(parentFolder.parentFolder);
    if (grandParentFolder) {
      body+=`, under ${grandParentFolder.name}`
    }else{
      body+=' in GATE';
    }

    // Use both parent and grandparent folder names in the notification body
    const title = document.name;

    // Send notification to all users
    const users = await User.find({ token: { $exists: true, $ne: null } });
    const tokens = users.map(user => user.token);
    const success = await sendFcmMessage(tokens, title, body);

    if (success) {
      res.status(200).send({ message: "Notification sent successfully" });
    } else {
      res.status(200).send({ message: "Failed to send some notifications" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { acceptDocument };


const getDocs = async (req, res) => {
  try {
    // Fetch documents and populate the uploadedBy field with the user information
    const docs = await Document.find().populate('uploadedBy', 'username email');

    // Format the documents to exclude fileId and include _id, username for uploadedBy
    const formattedDocs = docs.map(doc => ({
      _id: doc._id,
      name: doc.name,
      parentFolder: doc.parentFolder,
      avgRating: doc.avgRating,
      uploadedBy: doc.uploadedBy.username,
      createdAt: doc.createdAt,
      rscLink: doc.rscLink,
      viewLink: doc.viewLink,
      downloadLink: doc.downloadLink,
      isAccepted: doc.isAccepted
    }));

    if (formattedDocs.length > 0) {
      res.status(200).json({ docs: formattedDocs });
    } else {
      res.status(404).json({ message: "No docs found..." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadDocument,
  getDocumentsByFolder,
  getDocumentById,
  updateDocument,
  deleteDocument,
  commentOnDocument,
  saveDocument,
  acceptDocument,
  getDocs,
};
