const User = require("../model/User");
const Document = require("../model/Document");
const {sendFcmMessage}=require("../firebase/sendNotification");

const login = async (req, res) => {
  try {
    const { email, username } = req.userdata; // Destructure email and username from req
    const { token } = req.body;
    console.log(token);
    // Check if email, username, and token are present
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email, username, and token are required" });
    }

    // Find existing user by email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // Update token for the existing user
      existingUser.token = token;
      await existingUser.save();
      const bool=await sendFcmMessage([existingUser.token],"Welcome To CoursMate","From Team CoursMate");
      if(bool){
        console.log("Welcome To CoursMate "+existingUser.username);
      }
      else{
        console.log("notification not sent to "+existingUser.username);
      }
      return res
        .status(200)
        .json({
          message: "Login successful",
          _id: existingUser._id,
          username: existingUser.username,
        });
    } else {
      // Validate username and email domain for new user creation
      if (!username) {
        return res
          .status(400)
          .json({ message: "Username is required to create a new user" });
      }

      if (!email.endsWith("@rguktn.ac.in")) {
        return res
          .status(400)
          .json({ message: "Email domain not allowed", login: false });
      }

      // Create new user with token
      const newUser = new User({
        username,
        email,
        token,
      });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-_id -uploadedDocs");
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const exists = async (req, res) => {
  try {
    const { _id } = req.body;
    const userExists = await User.findById(_id);

    if (userExists) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId, updates } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDocs = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const documents = await Document.find({ uploadedBy: user._id });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserId = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      name: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const top10Contributions = async (req, res) => {
  try {
    const topUsers = await User.find({}, "username totalUploaded -_id")
      .sort({ totalUploaded: -1 })
      .limit(10);

    // Send the result as JSON
    res.status(200).json(topUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserDocs,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserId,
  getAllUsers,
  login,
  exists,
  top10Contributions,
};
