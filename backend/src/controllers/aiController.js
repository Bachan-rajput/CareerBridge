const Groq = require("groq-sdk");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { PDFParse } = require("pdf-parse");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================
// AI JOB MATCH
// =========================
const getJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Get logged-in student's profile
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can use AI Job Match",
      });
    }

    // Get job details
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const studentSkills = user.profile?.skills || [];

    const prompt = `
You are an AI Job Matching Assistant for a job portal.

Analyze the student's skills against the job requirements.

STUDENT:
Name: ${user.name}
Skills: ${studentSkills.join(", ") || "No skills provided"}
Resume: ${user.profile?.resume || "Not provided"}

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.skills?.join(", ") || "Not specified"}
Experience: ${job.experience || "Not specified"}
Job Type: ${job.jobType || "Not specified"}

Return ONLY valid JSON in this exact structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": "",
  "reason": ""
}

Rules:
- matchScore must be a number between 0 and 100.
- matchedSkills should contain skills the student has that are relevant to the job.
- missingSkills should contain important job skills the student does not appear to have.
- recommendation should be a short practical recommendation.
- reason should briefly explain the score.
- Do not include markdown.
- Do not include code fences.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        message: "AI did not return a response",
      });
    }

    let result;

    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("AI JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    res.status(200).json({
      message: "AI Job Match generated successfully",
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
      },
      result,
    });
  } catch (error) {
    console.error("AI Job Match error:", error);

    res.status(500).json({
      message: "Failed to generate AI Job Match",
    });
  }
};

// =========================
// AI RESUME ANALYZER
// =========================
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can use AI Resume Analyzer",
      });
    }

    const prompt = `
You are an AI Resume Analyzer for a professional job portal.

Analyze the following resume and provide practical feedback.

RESUME:
${resumeText}

Return ONLY valid JSON in this exact structure:

{
  "resumeScore": 0,
  "detectedSkills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "summary": ""
}

Rules:
- resumeScore must be a number between 0 and 100.
- detectedSkills should contain technical and professional skills found in the resume.
- strengths should contain important positive aspects of the resume.
- weaknesses should contain areas that could be improved.
- suggestions should contain specific actionable improvements.
- summary should be a short overall assessment.
- Do not include markdown.
- Do not include code fences.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        message: "AI did not return a response",
      });
    }

    let result;

    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Resume AI JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    res.status(200).json({
      message: "AI Resume Analysis generated successfully",
      result,
    });
  } catch (error) {
    console.error("AI Resume Analyzer error:", error);

    res.status(500).json({
      message: "Failed to analyze resume",
    });
  }
};

// =========================
// AI RESUME PDF ANALYZER
// =========================
const analyzeResumePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can use AI Resume Analyzer",
      });
    }

    // Extract text from uploaded PDF
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    const resumeText = pdfData.text?.trim();

    if (!resumeText) {
      return res.status(400).json({
        message: "Could not extract text from the PDF",
      });
    }

    const prompt = `
You are an AI Resume Analyzer for a professional job portal.

Analyze the following resume and provide practical feedback.

RESUME:
${resumeText}

Return ONLY valid JSON in this exact structure:

{
  "resumeScore": 0,
  "detectedSkills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "summary": ""
}

Rules:
- resumeScore must be a number between 0 and 100.
- detectedSkills should contain technical and professional skills found in the resume.
- strengths should contain important positive aspects of the resume.
- weaknesses should contain areas that could be improved.
- suggestions should contain specific actionable improvements.
- summary should be a short overall assessment.
- Do not include markdown.
- Do not include code fences.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        message: "AI did not return a response",
      });
    }

    let result;

    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Resume PDF AI JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    res.status(200).json({
      message: "AI Resume PDF Analysis generated successfully",
      fileName: req.file.originalname,
      result,
    });
  } catch (error) {
    console.error("AI Resume PDF Analyzer error:", error);

    res.status(500).json({
      message: "Failed to analyze resume PDF",
    });
  }
};

// =========================
// AI CANDIDATE MATCH
// =========================
const getCandidateMatch = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID is required",
      });
    }

    // Get application with job and candidate
    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "-password");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const job = application.job;
    const candidate = application.applicant;

    if (!job || !candidate) {
      return res.status(404).json({
        message: "Job or candidate information not found",
      });
    }

    // Only the recruiter who posted the job can analyze the candidate
    if (job.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to analyze this candidate",
      });
    }

    // Only recruiters can use this feature
    const recruiter = await User.findById(req.user.id);

    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can use AI Candidate Match",
      });
    }

    const candidateSkills = candidate.profile?.skills || [];

    const prompt = `
You are an AI Candidate Matching Assistant for a professional recruitment platform.

Analyze the candidate against the requirements of the job they applied for.

CANDIDATE:
Name: ${candidate.name}
Skills: ${candidateSkills.join(", ") || "No skills provided"}
Resume: ${candidate.profile?.resume || "Not provided"}
Application Cover Letter: ${application.coverLetter || "Not provided"}

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.skills?.join(", ") || "Not specified"}
Experience: ${job.experience || "Not specified"}
Job Type: ${job.jobType || "Not specified"}

Return ONLY valid JSON in this exact structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "recommendation": "",
  "reason": ""
}

Rules:
- matchScore must be a number between 0 and 100.
- matchedSkills should contain relevant skills the candidate has that match the job.
- missingSkills should contain important job skills the candidate does not appear to have.
- strengths should contain 2 to 4 relevant candidate strengths.
- recommendation should be a short practical recommendation for the recruiter.
- reason should briefly explain the match score using the available candidate and job information.
- Do not make assumptions about skills or experience that are not present in the provided data.
- Do not make the final hiring decision.
- Do not include markdown.
- Do not include code fences.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        message: "AI did not return a response",
      });
    }

    let result;

    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("AI Candidate Match JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    res.status(200).json({
      message: "AI Candidate Match generated successfully",
      application: {
        id: application._id,
        status: application.status,
      },
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
      },
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
      },
      result,
    });
  } catch (error) {
    console.error("AI Candidate Match error:", error);

    res.status(500).json({
      message: "Failed to generate AI Candidate Match",
    });
  }
};

module.exports = {
  getJobMatch,
  analyzeResume,
  analyzeResumePDF,
  getCandidateMatch,
};
