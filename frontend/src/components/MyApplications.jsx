import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
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

  const handleWithdraw = async (applicationId) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this application?",
    );

    if (!confirmWithdraw) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to withdraw application");
      }

      setApplications((previous) =>
        previous.filter((application) => application._id !== applicationId),
      );

      setError("");
    } catch (error) {
      console.error("Withdraw application error:", error);
      setError(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

            <p className="mt-4 text-sm text-slate-500">
              Loading applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
              My Applications
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Page Heading */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              My Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track your job applications and their current status.
            </p>
          </div>

          <div className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            {applications.length}{" "}
            {applications.length === 1 ? "Application" : "Applications"}
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              📄
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No Applications Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You haven't applied for any jobs yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-5">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md sm:p-7"
              >
                {/* Application Header */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Application
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-slate-900">
                      {application.job?.title || "Job Title"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {application.job?.company || "Company"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      application.status,
                    )}`}
                  >
                    {application.status || "Applied"}
                  </span>
                </div>

                {/* Job Details */}
                <div className="grid gap-4 border-b border-slate-100 py-5 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {application.job?.location || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Job Type
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {application.job?.jobType || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Salary
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                      {application.job?.salary
                        ? `₹${application.job.salary}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Application Information */}
                <div className="grid gap-5 border-b border-slate-100 py-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Resume
                    </p>

                    <p className="mt-1.5 break-all text-sm text-slate-700">
                      {application.resume || "Not uploaded"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Applied On
                    </p>

                    <p className="mt-1.5 text-sm text-slate-700">
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Cover Letter
                  </p>

                  <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {application.coverLetter || "No cover letter provided."}
                  </p>
                </div>

                {/* Withdraw */}
                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => handleWithdraw(application._id)}
                    disabled={
                      application.status === "Selected" ||
                      application.status === "Rejected"
                    }
                    className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {application.status === "Selected" ||
                    application.status === "Rejected"
                      ? "Withdrawal Unavailable"
                      : "Withdraw Application"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;
