const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const { userId, groupId, profileId } = req.query;

    const filter = { userId };
    
    if (groupId) {
      filter.groupId = groupId;
    } else {
      filter.groupId = null;
    }
    
    if (profileId && profileId !== "null") {
      filter.profileId = profileId;
    } else {
      filter.profileId = null;
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateNote = async (req, res) => {
  try {
    const { userId, groupId = null, profileId = null, content = "" } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // ✅ Exact profileId se dhundo
    const searchFilter = {
      userId,
      groupId: groupId || null,
      profileId: profileId || null,
    };

    console.log("Searching note with filter:", searchFilter);

    const existingNote = await Note.findOne(searchFilter);

    if (existingNote) {
      existingNote.content = content;
      existingNote.profileId = profileId || null;
      await existingNote.save();
      console.log("Note updated:", existingNote._id, "profileId:", existingNote.profileId);
      return res.status(200).json({
        message: "Note updated successfully",
        note: existingNote,
      });
    }

    const note = await Note.create({
      userId,
      groupId: groupId || null,
      profileId: profileId || null,
      content,
    });

    console.log("Note created:", note._id, "profileId:", note.profileId);

    res.status(201).json({
      message: "Note saved successfully",
      note,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNote = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  createOrUpdateNote,
  updateNote,
  deleteNote,
};