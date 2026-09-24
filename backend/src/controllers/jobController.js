const mongoose = require("mongoose");
const Job = require("../models/Job");

// =========================
// CREATE JOB
// =========================
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      jobType,
      salary,
      skills,
      experience,
      applicationDeadline,
    } = req.body;

    // Required fields
    if (!title || !company || !description || !location) {
      return res.status(400).json({
        message: "Title, company, description and location are required",
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      location,
      jobType,
      salary,
      skills,
      experience,
      applicationDeadline,
      postedBy: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET ALL JOBS
// =========================
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET SINGLE JOB
// =========================
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id).populate("postedBy", "name email role");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// UPDATE JOB
// =========================
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only job owner can update
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// DELETE JOB
// =========================
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only job owner can delete
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this job",
      });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// EXPORT CONTROLLERS
// =========================
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
