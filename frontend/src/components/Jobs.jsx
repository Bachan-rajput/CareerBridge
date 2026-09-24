import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/jobs`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-slate-500">Loading available jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              CareerBridge
            </h1>

            <p className="mt-1 text-sm text-slate-500">Find Jobs</p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-9 lg:px-8">
        {/* Page Heading */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Available Jobs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore jobs and internship opportunities.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
          </p>
        </div>

        {/* No Jobs */}
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              No Jobs Available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no jobs available.
            </p>
          </div>
        ) : (
          /* Job Cards */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                {/* Job Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-700">
                      {job.company}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {job.jobType || "Full-time"}
                  </span>
                </div>

                {/* Job Information */}
                <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {job.salary ? `₹${job.salary}` : "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {job.experience || "Fresher"}
                  </p>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    About the role
                  </p>

                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/job-details?id=${job._id}`;
                  }}
                  className="mt-6 w-full rounded-lg border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Details
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Jobs;
