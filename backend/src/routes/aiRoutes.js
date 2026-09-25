const express = require("express");

const {
  getJobMatch,
  analyzeResume,
  analyzeResumePDF,
} = require("../controllers/aiController");

const {
  generateInterviewQuestions,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// AI Job Match
router.post("/job-match", authMiddleware, getJobMatch);

// AI Resume Analyzer - text
router.post("/resume-analyze", authMiddleware, analyzeResume);

// AI Resume Analyzer - PDF
router.post(
  "/resume-analyze-pdf",
  authMiddleware,
  upload.single("resume"),
  analyzeResumePDF,
);

// AI Interview Preparation
router.post("/interview-prep", authMiddleware, generateInterviewQuestions);

module.exports = router;
