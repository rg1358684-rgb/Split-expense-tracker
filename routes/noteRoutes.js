const express = require("express");
const router = express.Router();

const {
  getNotes,
  createOrUpdateNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.get("/", getNotes);
router.post("/", createOrUpdateNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;