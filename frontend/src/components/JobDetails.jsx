import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function JobDetails() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application states
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);

  // Already applied states
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");

  // AI Job Match states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");

  // Get logged-in user
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isRecruiter = user?.role === "recruiter";

  // Get job ID from URL
  const jobId = new URLSearchParams(window.location.search).get("id");

  // =====================================================
  // FETCH JOB DETAILS
  // =====================================================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        if (!jobId) {
          setError("Job ID is missing.");
          return;
        }

        const response = await fetch(`${API_URL}/api/jobs/${jobId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJob(data.job);
      } catch (error) {
        console.error("Fetch job error:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // =====================================================
  // CHECK WHETHER STUDENT HAS ALREADY APPLIED
  // =====================================================
  useEffect(() => {
    const checkApplication = async () => {
      try {
        // Recruiters cannot apply
        if (isRecruiter) {
          return;
        }

        const token = localStorage.getItem("token");

        // User is not logged in
        if (!token || !jobId) {
          return;
        }

        const response = await fetch(`${API_URL}/api/applications/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const applications = data.applications || [];

        const existingApplication = applications.find(
          (application) =>
            application.job?._id === jobId || application.job === jobId,
        );

        if (existingApplication) {
          setHasApplied(true);
          setApplicationStatus(existingApplication.status || "Applied");
        }
      } catch (error) {
        console.error("Check application error:", error);
      }
    };

    checkApplication();
  }, [jobId, isRecruiter]);

  // =====================================================
  // AI JOB MATCH
  // =====================================================
  const handleAIJobMatch = async () => {
    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAiError("Please login as a student to use AI Job Match.");
        return;
      }

      if (!jobId) {
        setAiError("Job ID is missing.");
        return;
      }

      const response = await fetch(`${API_URL}/api/ai/job-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate AI Job Match");
      }

      setAiResult(data.result);
    } catch (error) {
      console.error("AI Job Match error:", error);
      setAiError(
        error.message || "Unable to generate AI Job Match. Please try again.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =====================================================
  // APPLY FOR JOB
  // =====================================================
  const handleApply = async (e) => {
    e.preventDefault();

    setApplyMessage("");
    setApplying(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setApplyMessage("Please login before applying.");
        return;
      }

      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          resume,
          coverLetter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApplyMessage(data.message || "Application failed");
        return;
      }

      setApplyMessage("Application submitted successfully!");

      setResume("");
      setCoverLetter("");

      setHasApplied(true);
      setApplicationStatus("Applied");

      setShowApplyForm(false);
    } catch (error) {
      console.error("Apply error:", error);
      setApplyMessage("Unable to connect to server");
    } finally {
      setApplying(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm text-slate-500">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/jobs";
            }}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Career<span className="text-blue-600">Bridge</span>
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Job Details
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/jobs";
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Job Header */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Job Opportunity
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {job.title}
              </h2>

              <p className="mt-2 text-base font-semibold text-blue-600">
                {job.company}
              </p>
            </div>

            <span className="w-fit shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              {job.jobType || "Full-time"}
            </span>
          </div>

          {/* Job Information */}
          <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1.5 text-sm font-medium text-slate-700">
                {job.location || "Not specified"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Salary
              </p>

              <p className="mt-1.5 text-sm font-medium text-slate-700">
                {job.salary ? `₹${job.salary}` : "Not specified"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Experience
              </p>

              <p className="mt-1.5 text-sm font-medium text-slate-700">
                {job.experience || "Fresher"}
              </p>
            </div>
          </div>
        </section>

        {/* Job Description */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Job Description
            </h3>
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
            {job.description}
          </p>
        </section>

        {/* Required Skills */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Required Skills
            </h3>
          </div>

          {job.skills && job.skills.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No specific skills listed.
            </p>
          )}
        </section>

        {/* =================================================
            AI JOB MATCH
            ONLY STUDENTS CAN SEE THIS
        ================================================= */}
        {!isRecruiter && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    ✦
                  </span>

                  <h3 className="text-lg font-semibold text-slate-900">
                    AI Job Match
                  </h3>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Compare your current skills with this job and get an
                  AI-generated match score, skill analysis and recommendation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAIJobMatch}
                disabled={aiLoading}
                className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiLoading ? "Analyzing..." : "Check AI Job Match"}
              </button>
            </div>

            {/* AI Error */}
            {aiError && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{aiError}</p>
              </div>
            )}

            {/* AI Result */}
            {aiResult && (
              <div className="mt-6 border-t border-slate-100 pt-6">
                {/* Match Score */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        AI Match Score
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Based on your current profile and this job's
                        requirements.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">
                          {aiResult.matchScore}%
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-slate-700">
                        Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {/* Matched Skills */}
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Matching Skills
                    </h4>

                    {aiResult.matchedSkills &&
                    aiResult.matchedSkills.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {aiResult.matchedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">
                        No matching skills identified.
                      </p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Skills to Improve
                    </h4>

                    {aiResult.missingSkills &&
                    aiResult.missingSkills.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {aiResult.missingSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">
                        No major skill gaps identified.
                      </p>
                    )}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-sm font-semibold text-slate-900">
                    AI Recommendation
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {aiResult.recommendation ||
                      "No recommendation was provided."}
                  </p>
                </div>

                {/* Reason */}
                <div className="mt-4 rounded-xl border border-slate-200 p-5">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Match Analysis
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {aiResult.reason || "No additional analysis available."}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            APPLICATION SECTION
            ONLY STUDENTS CAN SEE THIS
        ================================================= */}
        {!isRecruiter && (
          <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-6 sm:p-7">
            {/* Already Applied */}
            {hasApplied ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                      ✓
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                      Application Submitted
                    </h3>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    You have already applied for this position.
                  </p>

                  <div className="mt-3">
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Status: {applicationStatus}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/applications";
                  }}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View My Applications
                </button>
              </div>
            ) : !showApplyForm ? (
              /* Apply Button */
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Interested in this opportunity?
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Submit your application for this position.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem("token");

                    if (!token) {
                      setApplyMessage("Please login before applying.");
                      return;
                    }

                    setShowApplyForm(true);
                    setApplyMessage("");
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Apply Now
                </button>
              </div>
            ) : (
              /* Application Form */
              <div>
                <div className="border-b border-blue-100 pb-5">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Apply for {job.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Complete the form below to submit your application.
                  </p>
                </div>

                <form onSubmit={handleApply} className="mt-6 space-y-5">
                  {/* Resume */}
                  <div>
                    <label
                      htmlFor="resume"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Resume
                    </label>

                    <input
                      id="resume"
                      type="text"
                      placeholder="Enter your resume link"
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Example: Google Drive, GitHub or portfolio resume link
                    </p>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Cover Letter
                    </label>

                    <textarea
                      id="coverLetter"
                      rows="6"
                      placeholder="Write a short cover letter..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* Message */}
                  {applyMessage && (
                    <div
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        applyMessage === "Application submitted successfully!"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {applyMessage}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={applying}
                      className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowApplyForm(false);
                        setApplyMessage("");
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Login / Other Message */}
            {applyMessage && !showApplyForm && !hasApplied && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {applyMessage}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default JobDetails;
