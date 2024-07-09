const Resource = require('../model/Resource');
const Folder = require('../model/Folder');
const User = require('../model/User');
const mongoose = require('mongoose');
const {jwtDecode} = require('jwt-decode');

// const createResource = async (req, res) => {
//   const { name, description, rscLink, folderId, userId } = req.body;
//   console.log(folderId);
//   const bearerHeader = req.headers['authorization'];
//   if (typeof bearerHeader !== 'undefined') {
//     const bearerToken = bearerHeader.split(' ')[1];
//     try {
//       const decodedToken = jwtDecode(bearerToken);
//       const user = await User.findById({_id:userId});
//       console.log(user.email);
//       console.log(decodedToken.email);
//       if(!(decodedToken.email==user.email)){
//       return res.status(401).json({message: "User Not Allowed!!!"});
//     }}catch(error){
//       console.log(error);
//       return res.status(500).json({message: "Internal Server Error"});
//     }
//     try {
//       const user = await User.findById({_id:userId});
//       console.log(user);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
      
//       const folder = await Folder.find({_id:folderId});
//       console.log(folder);
//       if (folder.length<1 || (!folder)) {
//         return res.status(404).json({ message: 'Folder not found' });
//       }
  
//       const newResource = new Resource({
//         name,
//         description,
//         rscLink,
//         uploadedBy: user._id,
//         parentFolder: folder._id,
//         byAdmin: user.isAdmin
//       });
//       const savedResource = await newResource.save();
  
//       // Increment the totalUploaded count for the user
//       user.totalUploaded += 0;
//       await user.save();
  
//       res.status(201).json(savedResource);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
//   };


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createResource = async (req, res) => {
  const { name, description, rscLink, folderId, userId } = req.body;
  
  // Validate folderId and userId
  if (!isValidObjectId(folderId)) {
    return res.status(400).json({ message: 'Invalid folderId' });
  }
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    try {
      const decodedToken = jwtDecode(bearerToken);
      const user = await User.findById(userId);
      if (!(decodedToken.email === user.email)) {
        return res.status(401).json({ message: "User Not Allowed!!!" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const folder = await Folder.findById(folderId);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }

      const newResource = new Resource({
        name,
        description,
        rscLink,
        uploadedBy: user._id,
        parentFolder: folder._id,
        byAdmin: user.isAdmin
      });
      const savedResource = await newResource.save();

      // Increment the totalUploaded count for the user
      user.totalUploaded += 0;
      await user.save();

      res.status(201).json(savedResource);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(403).json({ message: "Forbidden" });
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

// const deleteResource = async (req, res) => {
//     const { rscId } = req.body;

//     try {
//         const resource = await Resource.findById(rscId);
//         if (!resource) {
//             return res.status(404).json({ message: 'Resource not found' });
//         }

//         await Resource.findByIdAndDelete(rscId);
//         res.status(200).json({ message: 'Resource deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

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
  try {
    const { rscId } = req.body;

    // Validate rscId
    if (!rscId) {
      return res.status(400).json({ message: 'Resource ID is required' });
    }

    // Find the resource and update isAccepted field
    const updatedResource = await Resource.findByIdAndUpdate(
      rscId,
      { isAccepted: true },
      { new: true }
    );

    // Check if resource was found and updated
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment the totalUploaded count of the user who uploaded the resource
    const user = await User.findById(updatedResource.uploadedBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndUpdate(
      updatedResource.uploadedBy,
      { $inc: { totalUploaded: 1 } }
    );

    // Return the updated resource
    res.status(200).json({ message: 'Resource accepted successfully', resource: updatedResource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createResource, getResourceById, updateResource, deleteResource, getResourcesByFolder, getResourcesByUser,getAllResource ,acceptResource};
