import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ReceivedApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [candidateMatch, setCandidateMatch] = useState(null);
  const [aiMatchingId, setAiMatchingId] = useState("");
  const [aiResults, setAiResults] = useState({});

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(`${API_URL}/api/applications/received`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      setApplications(data.applications || []);
    } catch (error) {
      console.error("Fetch applications error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update application status");
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application,
        ),
      );

      setMessage(`Application status updated to ${status}.`);
    } catch (error) {
      console.error("Update status error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setUpdatingId("");
    }
  };

  const getCandidateMatch = async (applicationId) => {
    try {
      setAiMatchingId(applicationId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(`${API_URL}/api/ai/candidate-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate AI Candidate Match",
        );
      }

      setAiResults((previousResults) => ({
        ...previousResults,
        [applicationId]: data.result,
      }));

      setMessage("AI Candidate Match generated successfully.");
    } catch (error) {
      console.error("AI Candidate Match error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setAiMatchingId("");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Selected":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

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
              Received Applications
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Page Title & Count */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Manage Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage applications received for your jobs.
            </p>
          </div>

          {!loading && !error && (
            <span className="text-sm font-medium text-slate-500">
              {applications.length}{" "}
              {applications.length === 1 ? "Application" : "Applications"}
            </span>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">{message}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-slate-500">
              Loading applications...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              📄
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No Applications Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't received any applications for your posted jobs yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/my-jobs";
              }}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View My Jobs
            </button>
          </div>
        )}

        {/* Applications List Grid */}
        {!loading && !error && applications.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {applications.map((application) => (
              <div
                key={application._id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                      {application.applicant?.name || "Unknown Candidate"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {application.applicant?.email || "Email not available"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      application.status,
                    )}`}
                  >
                    {application.status || "Applied"}
                  </span>
                </div>

                {/* Job Information Box */}
                <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Applied For
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {application.job?.title || "Job Title"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {application.job?.company || "Company"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {application.job?.location || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Applied On
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Cover Letter
                    </p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resume Link */}
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Resume
                  </p>
                  {application.resume ? (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                    >
                      View Resume Document ↗
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      No resume provided
                    </p>
                  )}
                </div>
                {/* Candidate Details */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApplication(application);
                      setCandidateMatch(aiResults[application._id] || null);
                      setMatchError("");
                    }}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    View Candidate Details
                  </button>
                </div>

                {/* AI Candidate Match */}
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        🤖 AI Candidate Match
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Analyze this candidate's skills against the job
                        requirements using AI.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => getCandidateMatch(application._id)}
                      disabled={aiMatchingId === application._id}
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {aiMatchingId === application._id
                        ? "Analyzing..."
                        : "Check AI Match"}
                    </button>
                  </div>
                </div>

                {/* AI Candidate Match Result */}
                {aiResults[application._id] && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          AI Match Analysis
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          AI-generated candidate and job compatibility analysis.
                        </p>
                      </div>

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-50">
                        <span className="text-sm font-bold text-blue-700">
                          {aiResults[application._id].matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Match Score
                        </p>

                        <p className="text-sm font-bold text-blue-700">
                          {aiResults[application._id].matchScore}%
                        </p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{
                            width: `${aiResults[application._id].matchScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Matched Skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {aiResults[application._id].matchedSkills?.length >
                        0 ? (
                          aiResults[application._id].matchedSkills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                              >
                                ✓ {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-sm text-slate-500">
                            No matched skills found.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Missing Skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {aiResults[application._id].missingSkills?.length >
                        0 ? (
                          aiResults[application._id].missingSkills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                              >
                                • {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-sm text-slate-500">
                            No major missing skills detected.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Candidate Strengths
                      </p>

                      <ul className="mt-2 space-y-2">
                        {aiResults[application._id].strengths?.map(
                          (strength, index) => (
                            <li
                              key={index}
                              className="text-sm leading-6 text-slate-700"
                            >
                              ✓ {strength}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        AI Recommendation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {aiResults[application._id].recommendation}
                      </p>
                    </div>

                    {/* Reason */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Analysis
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {aiResults[application._id].reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Update Actions */}
                <div className="mt-auto pt-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Update Status
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Applied",
                      "Shortlisted",
                      "Interview",
                      "Selected",
                      "Rejected",
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={updatingId === application._id}
                        onClick={() => updateStatus(application._id, status)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          application.status === status
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Candidate Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Candidate Profile
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedApplication.applicant?.name || "Unknown Candidate"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedApplication.applicant?.email ||
                    "Email not available"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Candidate Information */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Candidate Name
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedApplication.applicant?.name || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                  {selectedApplication.applicant?.email || "Not available"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applied For
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedApplication.job?.title || "Not available"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedApplication.job?.company || "Company not available"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {selectedApplication.status || "Applied"}
                </p>
              </div>
            </div>

            {/* Application Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Application Information
              </h3>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedApplication.job?.location || "Not specified"}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Applied On
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {selectedApplication.createdAt
                      ? new Date(
                          selectedApplication.createdAt,
                        ).toLocaleDateString("en-IN")
                      : "Not available"}
                  </p>
                </div>

                {selectedApplication.coverLetter && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cover Letter
                    </p>

                    <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900">Resume</h3>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {selectedApplication.resume ? (
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Resume ↗
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">No resume provided.</p>
                )}
              </div>
            </div>
            {/* AI Candidate Match */}
            {candidateMatch && (
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      AI Candidate Match
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      AI-generated candidate and job compatibility analysis.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-200 bg-white text-sm font-bold text-blue-700">
                    {candidateMatch.matchScore}%
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Match Score
                    </p>

                    <p className="text-sm font-bold text-blue-700">
                      {candidateMatch.matchScore}%
                    </p>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${candidateMatch.matchScore}%`,
                      }}
                    />
                  </div>
                </div>

                {candidateMatch.matchedSkills?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Matched Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidateMatch.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {candidateMatch.missingSkills?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Missing Skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidateMatch.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                        >
                          • {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {candidateMatch.strengths?.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Candidate Strengths
                    </p>

                    <div className="mt-2 space-y-2">
                      {candidateMatch.strengths.map((strength, index) => (
                        <p
                          key={index}
                          className="text-sm leading-6 text-slate-700"
                        >
                          ✓ {strength}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {candidateMatch.recommendation && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      AI Recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {candidateMatch.recommendation}
                    </p>
                  </div>
                )}

                {candidateMatch.reason && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Analysis
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {candidateMatch.reason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceivedApplications;
