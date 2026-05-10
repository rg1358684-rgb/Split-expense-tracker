const mongoose = require("mongoose");
const Group = require("../models/Group");

const createGroup = async (req, res) => {
  try {
    const { userId, profileId, groupName, members, notes } = req.body;

    if (!userId || !groupName) {
      return res.status(400).json({ message: "userId and groupName are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (profileId && profileId !== "null" && !mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ message: "Invalid profileId" });
    }

    const group = await Group.create({
      userId,
      profileId: profileId && profileId !== "null" ? profileId : null,
      groupName,
      members: members || [],
      notes: notes || "",
    });

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.log("Create Group Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const { userId, profileId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    let filter;
    if (profileId && profileId !== "null") {
      filter = { userId, profileId };
    } else {
      filter = { userId, profileId: null };
    }

    const groups = await Group.find(filter).sort({ createdAt: -1 });

    res.status(200).json(groups);

  } catch (error) {
    console.log("Get Groups Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group id" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const group = await Group.findOne({ _id: id, userId });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Get Group By Id Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGroup, getGroups, getGroupById };