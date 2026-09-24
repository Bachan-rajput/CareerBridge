const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new job
router.post("/", authMiddleware, createJob);

// Get all jobs
router.get("/", getAllJobs);

// Get single job
router.get("/:id", getJobById);

// Update job
router.put("/:id", authMiddleware, updateJob);

// Delete job
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
