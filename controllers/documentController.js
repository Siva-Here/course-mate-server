const User = require("../model/User");
const Document = require("../model/Document");
const Comment = require("../model/Comment");
const Folder = require("../model/Folder");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { format } = require("date-fns");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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
    fileSize: 30 * 1024 * 1024, // 30MB limit
  },
}).single("file");

const getDocumentsByFolder = async (req, res) => {
  const { folderId } = req.body;

  try {
    const documents = await Document.find({ parentFolder: folderId });
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
        return res
          .status(400)
          .json({ error: "File is too large. Maximum size allowed is 30MB." });
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
      fs.unlinkSync(req.file.path);
      return res
        .status(500)
        .json({ error: "Failed to upload the file to Google Drive." });
    }
  });
};

const saveDocument = async (req, res) => {
  const { fileId, name, viewLink, downloadLink, parentFolder, uploadedBy } = req.body;

  if (!fileId || !name || !viewLink || !downloadLink || !parentFolder || !uploadedBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
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

    // Find the user and update their totalUploaded count and uploadedDocs array
    await User.findByIdAndUpdate(
      uploadedBy,
      {
        $inc: { totalUploaded: 1 },
        $push: { uploadedDocs: savedDocument._id }
      },
      { new: true } // This option returns the modified document rather than the original
    );

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
      parentFolder.contents = parentFolder.contents.filter(
        (docId) => docId.toString() !== docId
      );
      await parentFolder.save();
    }

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

module.exports = {
  uploadDocument,
  getDocumentsByFolder,
  getDocumentById,
  updateDocument,
  deleteDocument,
  commentOnDocument,
  saveDocument,
};
