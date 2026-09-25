const Application = require("../models/Application");
const Job = require("../models/Job");

// =========================
// APPLY FOR JOB
// =========================
const applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: resume || "",
      coverLetter: coverLetter || "",
    });

    // Populate application
    const populatedApplication = await Application.findById(application._id)
      .populate(
        "job",
        "title company description location jobType salary skills experience",
      )
      .populate("applicant", "name email role");

    return res.status(201).json({
      message: "Job application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Apply job error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET MY APPLICATIONS
// =========================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate(
        "job",
        "title company description location jobType salary skills experience",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET RECEIVED APPLICATIONS
// =========================
// Applications received on jobs posted by logged-in user
const getReceivedApplications = async (req, res) => {
  try {
    // Find jobs posted by logged-in user
    const jobs = await Job.find({
      postedBy: req.user.id,
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Find applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate(
        "job",
        "title company description location jobType salary skills experience",
      )
      .populate("applicant", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get received applications error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET SINGLE APPLICATION
// =========================
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate(
        "job",
        "title company description location jobType salary skills experience postedBy",
      )
      .populate("applicant", "name email role");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Applicant or job owner can view
    const isApplicant = application.applicant._id.toString() === req.user.id;

    const isJobOwner =
      application.job.postedBy &&
      application.job.postedBy.toString() === req.user.id;

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        message: "You are not allowed to view this application",
      });
    }

    return res.status(200).json({
      application,
    });
  } catch (error) {
    console.error("Get application error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// UPDATE APPLICATION STATUS
// =========================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    // Check status
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
        allowedStatuses,
      });
    }

    // Find application
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Find related job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only job owner can update application status
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this application",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    // Get updated populated application
    const updatedApplication = await Application.findById(application._id)
      .populate(
        "job",
        "title company description location jobType salary skills experience",
      )
      .populate("applicant", "name email role");

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// WITHDRAW APPLICATION
// =========================
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Only applicant can withdraw
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to withdraw this application",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw application error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// RECRUITER ANALYTICS
// =========================
const getRecruiterAnalytics = async (req, res) => {
  try {
    // Recruiter ke jobs find karo
    const jobs = await Job.find({
      postedBy: req.user.id,
    }).select("_id title company");

    const jobIds = jobs.map((job) => job._id);

    // Agar recruiter ne abhi koi job post nahi ki
    if (jobIds.length === 0) {
      return res.status(200).json({
        message: "Recruiter analytics fetched successfully",
        analytics: {
          totalJobs: 0,
          totalApplications: 0,
          applied: 0,
          shortlisted: 0,
          interview: 0,
          selected: 0,
          rejected: 0,
          jobWiseApplications: [],
        },
      });
    }

    // All applications received for recruiter's jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    }).select("job status");

    // Status counts
    const totalApplications = applications.length;

    const applied = applications.filter(
      (application) => application.status === "Applied",
    ).length;

    const shortlisted = applications.filter(
      (application) => application.status === "Shortlisted",
    ).length;

    const interview = applications.filter(
      (application) => application.status === "Interview",
    ).length;

    const selected = applications.filter(
      (application) => application.status === "Selected",
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "Rejected",
    ).length;

    // Job-wise application count
    const jobWiseApplications = jobs.map((job) => {
      const jobApplications = applications.filter(
        (application) => application.job.toString() === job._id.toString(),
      );

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        applications: jobApplications.length,
      };
    });

    res.status(200).json({
      message: "Recruiter analytics fetched successfully",
      analytics: {
        totalJobs: jobs.length,
        totalApplications,
        applied,
        shortlisted,
        interview,
        selected,
        rejected,
        jobWiseApplications,
      },
    });
  } catch (error) {
    console.error("Recruiter analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch recruiter analytics",
    });
  }
};

// =========================
// EXPORT CONTROLLERS
// =========================
module.exports = {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getRecruiterAnalytics,
};
