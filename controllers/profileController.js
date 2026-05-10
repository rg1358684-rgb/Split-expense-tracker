const Profile = require("../models/Profile");

const getProfiles = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { userId } : {};
    const profiles = await Profile.find(filter).sort({ createdAt: -1 });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const { userId, profileName, email, avatar, isActive } = req.body;

    if (!userId || !profileName) {
      return res.status(400).json({ message: "userId and profileName are required" });
    }

    if (isActive) {
      await Profile.updateMany({ userId }, { isActive: false });
    }

    const profile = await Profile.create({
      userId,
      profileName,
      email: email || "",
      avatar: avatar || "",
      isActive: !!isActive,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProfile = await Profile.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await Profile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
};