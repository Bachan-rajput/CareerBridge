import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function ReceivedApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

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
    </div>
  );
}

export default ReceivedApplications;
