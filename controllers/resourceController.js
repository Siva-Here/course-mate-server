const Resource = require('../model/Resource');
const Folder = require('../model/Folder');
const User = require('../model/User');
const mongoose = require('mongoose');

const createResource = async (req, res) => {
    const { name, description, rscLink, folderId, userId } = req.body;
  
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
      user.totalUploaded += 1;
      await user.save();
  
      res.status(201).json(savedResource);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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
    const resources = await Resource.find();

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
            uploadedBy: user.username
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

const acceptResource=async(req,res)=>{
  try{

  }
  catch(err){
    
  }
}

module.exports = { createResource, getResourceById, updateResource, deleteResource, getResourcesByFolder, getResourcesByUser,getAllResource ,acceptResource};
