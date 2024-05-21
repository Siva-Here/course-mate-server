const Contribution = require('../model/Contribution');

// Create a new contribution
const createContribution = async (req, res) => {
    const { content, userId, documentId } = req.body;

    try {
        const newContribution = new Contribution({
            content,
            userId,
            documentId,
        });

        const savedContribution = await newContribution.save();
        res.status(201).json(savedContribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get contribution details by ID
const getContribution = async (req, res) => {
    const { id } = req.params;

    try {
        const contribution = await Contribution.findById(id);
        if (!contribution) {
            return res.status(404).json({ message: 'Contribution not found' });
        }

        res.status(200).json(contribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a contribution
const updateContribution = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedContribution = await Contribution.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedContribution) {
            return res.status(404).json({ message: 'Contribution not found' });
        }

        res.status(200).json(updatedContribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a contribution
const deleteContribution = async (req, res) => {
    const { id } = req.params;

    try {
        const contribution = await Contribution.findByIdAndDelete(id);
        if (!contribution) {
            return res.status(404).json({ message: 'Contribution not found' });
        }

        res.status(200).json({ message: 'Contribution deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all contributions made by a user
const getUserContributions = async (req, res) => {
    const { userId } = req.params;

    try {
        const contributions = await Contribution.find({ userId });
        if (!contributions) {
            return res.status(404).json({ message: 'Contributions not found' });
        }

        res.status(200).json(contributions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all contributions related to a document
const getDocumentContributions = async (req, res) => {
    const { docId } = req.params;

    try {
        const contributions = await Contribution.find({ documentId: docId });
        if (!contributions) {
            return res.status(404).json({ message: 'Contributions not found' });
        }

        res.status(200).json(contributions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createContribution, getContribution, updateContribution, deleteContribution, getUserContributions, getDocumentContributions };
