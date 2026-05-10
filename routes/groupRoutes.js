const express = require("express");
const router = express.Router();
const Group = require("../models/Group");

const {
  createGroup,
  getGroups,
  getGroupById,
} = require("../controllers/groupController");

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:id", getGroupById);

router.put("/:id/notes", async (req, res) => {
  try {
    const { notes, userId } = req.body;

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: req.params.id},
      { notes },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save notes",
      error: error.message,
    });
  }
});

module.exports = router;