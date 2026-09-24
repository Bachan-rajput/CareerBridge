const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  getApplicationById,
  withdrawApplication,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// APPLY FOR JOB
// POST /api/applications
// =========================
router.post("/", authMiddleware, applyForJob);

// =========================
// GET MY APPLICATIONS
// GET /api/applications/my
// =========================
router.get("/my", authMiddleware, getMyApplications);

// =========================
// GET RECEIVED APPLICATIONS
// GET /api/applications/received
// =========================
router.get("/received", authMiddleware, getReceivedApplications);

// =========================
// GET SINGLE APPLICATION
// GET /api/applications/:id
// =========================
router.get("/:id", authMiddleware, getApplicationById);

// =========================
// WITHDRAW APPLICATION
// DELETE /api/applications/:id
// =========================
router.delete("/:id", authMiddleware, withdrawApplication);

// Update application status
router.put("/:id/status", authMiddleware, updateApplicationStatus);

module.exports = router;
