const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const defaultProfile = await Profile.create({
      userId: user._id,
      profileName: name || "My Profile",
      email: user.email,
      isActive: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      defaultProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const profiles = await Profile.find({ userId: user._id });

    res.status(200).json({
      message: "Login successful",
      user,
      profiles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };