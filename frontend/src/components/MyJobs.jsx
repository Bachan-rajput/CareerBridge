import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      // Backend se saare jobs aa rahe hain.
      // Sirf current recruiter ke posted jobs show karenge.
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      const myJobs = (data.jobs || data).filter((job) => {
        const postedBy = job.postedBy;

        if (!postedBy) return false;

        const postedById =
          typeof postedBy === "object" ? postedBy._id : postedBy;

        return postedById === currentUser.id;
      });

      setJobs(myJobs);
    } catch (error) {
      console.error("Fetch my jobs error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job._id !== jobId),
      );

      setMessage("Job deleted successfully.");
    } catch (error) {
      console.error("Delete job error:", error);
      setError(error.message || "Something went wrong");
    }
  };

  const handleViewDetails = (jobId) => {
    window.location.href = `/job-details?id=${jobId}`;
  };

  const handleEdit = (jobId) => {
    window.location.href = `/edit-job?id=${jobId}`;
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
              My Posted Jobs
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
              Manage Jobs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View, edit, and manage the jobs you have posted.
            </p>
          </div>

          {!loading && !error && (
            <span className="text-sm font-medium text-slate-500">
              {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Posted
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
            <p className="mt-4 text-sm text-slate-500">Loading your jobs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              💼
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No Jobs Posted Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't posted any jobs or internship opportunities yet.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/post-job";
              }}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Post a Job
            </button>
          </div>
        )}

        {/* Jobs List Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex min-h-[285px] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {job.company}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {job.jobType || "Full-time"}
                  </span>
                </div>

                {/* Job Information */}
                <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {job.salary ? `₹${job.salary}` : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Experience
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {job.experience || "Fresher"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Posted On
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {job.description && (
                  <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 4 && (
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions Button Group */}
                <div className="mt-auto flex flex-wrap items-center justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(job._id)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(job._id)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(job._id)}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
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

export default MyJobs;
