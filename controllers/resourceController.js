const Resource = require('../model/Resource');
const Folder = require('../model/Folder');
const User = require('../model/User');
const mongoose = require('mongoose');
const { jwtDecode } = require('jwt-decode');
const { sendFcmMessage } = require('../firebase/sendNotification');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createResource = async (req, res) => {
  const { name, description, rscLink, folderId, userId } = req.body;
  const {email} = req.userdata;

  // Validate folderId and userId
  if (!isValidObjectId(folderId)) {
    return res.status(400).json({ message: 'Invalid folderId' });
  }
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).json({ message: "Authorization token is required" });
  }

  const bearerToken = bearerHeader.split(' ')[1];

  try {
    const decodedToken = jwtDecode(bearerToken);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (decodedToken.email !== user.email) {
      return res.status(401).json({ message: "User Not Allowed!!!" });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const authPlacement = (process.env.ADMIN_EMAILS.split(",").includes(email)) || (process.env.PLACEMENT_EMAILS.split(",").includes(email));
    const newResource = new Resource({
      name,
      description,
      rscLink,
      uploadedBy: user._id,
      parentFolder: folder._id,
      byAdmin: user.isAdmin,
      isAccepted: folder.name === "placements" && authPlacement,
      isPlacement: folder.name === "placements" && authPlacement
    });

    const savedResource = await newResource.save();

    // Increment the totalUploaded count for the user
    user.totalUploaded += 0; // Assuming the totalUploaded field should be incremented
    await user.save();

    // Notification logic for all resources
    const title = newResource.name;
    const body = `Resource "${newResource.name}" uploaded in ${folder.name} folder to be accepted`;

    // Send notification to all admin users
    const adminUsers = await User.find({ isAdmin: true, token: { $exists: true, $ne: null } });
    const adminTokens = adminUsers.map(admin => admin.token);

    const adminNotificationResult = await sendFcmMessage(adminTokens, title, body);

    if (adminNotificationResult) {
      console.log("Admin notification sent successfully");
    } else {
      console.log("Failed to send admin notifications");
    }

    // Additional notification logic for placement resources
    if (folder.name === "placements") {
      if((!process.env.ADMIN_EMAILS.split(",").includes(email)) || (!process.env.PLACEMENT_EMAILS.split(",").includes(email))){
        return res.status(401).json({message: "Unauthorized to add a placement"});
      }
      const placementTitle = name;
      const placementBody = `${name} brochure uploaded in placements`;

      const users = await User.find({ token: { $exists: true, $ne: null } });
      const userTokens = users.map(user => user.token);

      const placementNotificationResult = await sendFcmMessage(userTokens, placementTitle, placementBody);

      if (placementNotificationResult) {
        console.log("Placement notifications sent successfully");
      } else {
        console.log("Failed to send some placement notifications");
      }
    }

    return res.status(201).json(savedResource);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



const getResourceById = async (req, res) => {
  const { rscId } = req.body;

  try {
    const resource = await Resource.findById(rscId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateResource = async (req, res) => {
  const { rscId, name, description, rscLink } = req.body;

  try {
    const resource = await Resource.findById(rscId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.name = name || resource.name;
    resource.description = description || resource.description;
    resource.rscLink = rscLink || resource.rscLink;

    const updatedResource = await resource.save();
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllResource = async (req, res) => {
  try {
    const resources = await Resource.find().select();
    // note
    const updatedResources = await Promise.all(
      resources.map(async (resource) => {
        const user = await User.findById(resource.uploadedBy).select('username');
        return {
          ...resource._doc,
          uploadedBy: user ? user.username : 'Unknown'
        };
      })
    );

    res.status(200).json(updatedResources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteResource = async (req, res) => {
  const { rscId } = req.body;

  try {
    const resource = await Resource.findById(rscId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Get the user who uploaded the resource
    const user = await User.findById(resource.uploadedBy);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's totalUploaded count to decrement by 0
    await User.findByIdAndUpdate(user._id, { $inc: { totalUploaded: -0 } });

    // Delete the resource from the database
    await Resource.findByIdAndDelete(rscId);

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getResourcesByFolder = async (req, res) => {
  const { folderId } = req.body;

  try {
    // Fetch resources by folderId
    const resources = await Resource.find({ parentFolder: folderId });

    // Iterate over each resource to replace uploadedBy with the username
    const updatedResources = await Promise.all(
      resources.map(async (resource) => {
        const user = await User.findById(resource.uploadedBy).select('username');
        return {
          ...resource._doc,
          uploadedBy: user ? user.username : 'Unknown'
        };
      })
    );

    res.status(200).json(updatedResources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getResourcesByUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const resources = await Resource.find({ uploadedBy: userId });
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptResource = async (req, res) => {
  const { rscId } = req.body;

  try {
    // Validate rscId
    if (!rscId) {
      return res.status(400).json({ message: 'Resource ID is required' });
    }

    // Find the resource
    const resource = await Resource.findById(rscId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update the isAccepted field
    resource.isAccepted = true;
    await resource.save();

    // Increment the totalUploaded count of the user who uploaded the resource
    const user = await User.findById(resource.uploadedBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndUpdate(resource.uploadedBy, { $inc: { totalUploaded: 1 } });

    // Retrieve the parent folder
    const parentFolder = await Folder.findById(resource.parentFolder);
    if (!parentFolder) {
      return res.status(404).json({ message: 'Parent folder not found' });
    }

    // Retrieve the parent of the parent folder (grandparent folder)
    let grandParentFolder;
    if (parentFolder.parentFolder) {
      grandParentFolder = await Folder.findById(parentFolder.parentFolder);
    }

    // Use both parent and grandparent folder names in the notification body
    const title = resource.name;
    let body = `Resource uploaded in ${parentFolder.name}`;
    if (grandParentFolder) {
      body += `, under ${grandParentFolder.name}`;
    }

    // Send notification to all users with valid tokens
    const users = await User.find({ token: { $exists: true, $ne: null } });

    // Extract tokens from users
    const tokens = users.map(user => user.token);

    // Send FCM message with tokens array
    const notificationResult = await sendFcmMessage(tokens, title, body);

    if (notificationResult) {
      res.status(200).send({ message: "Notification sent successfully" });
    } else {
      res.status(200).send({ message: "Failed to send notifications" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createResource, getResourceById, updateResource, deleteResource, getResourcesByFolder, getResourcesByUser, getAllResource, acceptResource };
