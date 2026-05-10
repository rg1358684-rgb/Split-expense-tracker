const express = require("express");
const router = express.Router();

const {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

router.get("/", getProfiles);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

module.exports = router;