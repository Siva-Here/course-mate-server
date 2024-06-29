const User = require('../model/User');
const Document = require('../model/Document');

const login=async(req,res)=>{
    try{
        res.status(200).json({message:"Login successfull"})
    }
    catch(err){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}
const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find();
        if(users.length>0){
            res.status(200).json(users);
        }
        else{
            res.status(404).json({message:"No users found"})
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getUserProfile = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    const { userId, updates } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



const getUserDocs = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const documents = await Document.find({ uploadedBy: user._id });
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserId = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ userId: user._id ,
            name:user.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserDocs, getUserProfile, updateUserProfile, deleteUser,getUserId,getAllUsers,login};