const Groq = require("groq-sdk");
const User = require("../models/User");
const Job = require("../models/Job");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =========================
// AI INTERVIEW PREPARATION
// =========================
const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Get logged-in student
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can use AI Interview Preparation",
      });
    }

    // Get job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const studentSkills = user.profile?.skills || [];

    const prompt = `
You are an AI Interview Preparation Assistant for a professional job portal.

Generate interview preparation questions based on the student's skills and the selected job.

STUDENT:
Name: ${user.name}
Skills: ${studentSkills.join(", ") || "No skills provided"}

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.skills?.join(", ") || "Not specified"}
Experience: ${job.experience || "Not specified"}
Job Type: ${job.jobType || "Not specified"}

Generate exactly 8 interview questions:
- 4 technical questions
- 2 HR/behavioral questions
- 2 job-specific questions

For every question provide:
- question
- category
- difficulty
- answerHint

Return ONLY valid JSON in this exact structure:

{
  "questions": [
    {
      "question": "",
      "category": "Technical",
      "difficulty": "Easy",
      "answerHint": ""
    }
  ],
  "preparationTips": []
}

Rules:
- questions must contain exactly 8 questions.
- category must be one of: Technical, HR, Job-specific.
- difficulty must be one of: Easy, Medium, Hard.
- answerHint should be practical and concise.
- preparationTips should contain 4 useful preparation tips.
- Questions should be relevant to the selected job.
- Do not invent skills that are not related to the job.
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
      temperature: 0.3,
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
      console.error("Interview AI JSON parse error:", parseError);
      console.error("AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    res.status(200).json({
      message: "AI Interview Preparation generated successfully",
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
      },
      result,
    });
  } catch (error) {
    console.error("AI Interview Preparation error:", error);

    res.status(500).json({
      message: "Failed to generate AI Interview Preparation",
    });
  }
};

module.exports = {
  generateInterviewQuestions,
};
