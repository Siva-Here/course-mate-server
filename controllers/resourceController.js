const mongoose = require('mongoose');
const Resource = require('../model/Resource');
const Folder = require('../model/Folder');
const User = require('../model/User');


const createResource = async (req, res) => {
    const { name, description, rscLink, folderId, userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
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
            parentFolder: folder._id
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getResourceById = async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await Resource.findById(id);
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
    const { id } = req.params;
    const { name, description, rscLink } = req.body;

    try {
        const resource = await Resource.findById(id);
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


const deleteResource = async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await Resource.findByIdAndDelete(id);
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getResourcesByFolder = async (req, res) => {
    const { folderId } = req.params;

    try {
        const resources = await Resource.find({ parentFolder: folderId });
        res.status(200).json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getResourcesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const resources = await Resource.find({ uploadedBy: userId });
        res.status(200).json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createResource, getResourceById, updateResource, deleteResource, getResourcesByFolder, getResourcesByUser };
