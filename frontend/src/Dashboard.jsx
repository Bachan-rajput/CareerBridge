import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobsError("");

      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      setJobsError(error.message || "Unable to load jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
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
              Student Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Welcome Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                    Welcome, {user?.name || "User"} 👋
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your profile, explore jobs and track your
                    applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                  {user?.email || "Not available"}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                  {user?.role || "Student"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access your CareerBridge features.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Find Jobs */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                🔎
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Find Jobs
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                Explore available jobs and internship opportunities.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/jobs";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Jobs
              </button>
            </div>

            {/* Applications */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                📄
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                My Applications
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                Track your job applications and their current status.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/applications";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                My Applications
              </button>
            </div>

            {/* Profile */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                👤
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                My Profile
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                Update your personal information and skills.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/profile";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Profile
              </button>
            </div>
          </div>
        </section>

        {/* Available Jobs */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Available Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explore the latest jobs and internship opportunities.
              </p>
            </div>

            {!jobsLoading && !jobsError && (
              <span className="text-sm font-medium text-slate-500">
                {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </span>
            )}
          </div>

          {/* Loading */}
          {jobsLoading && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>

              <p className="mt-4 text-sm text-slate-500">
                Loading available jobs...
              </p>
            </div>
          )}

          {/* Error */}
          {!jobsLoading && jobsError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-700">{jobsError}</p>

              <button
                type="button"
                onClick={fetchJobs}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Jobs */}
          {!jobsLoading && !jobsError && jobs.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                💼
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No Jobs Available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are currently no jobs or internship opportunities
                available.
              </p>
            </div>
          )}

          {/* Jobs */}
          {!jobsLoading && !jobsError && jobs.length > 0 && (
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
                        {job.salary ? `₹${job.salary}` : "Salary not specified"}
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
                        Type
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {job.jobType || "Full-time"}
                      </p>
                    </div>
                  </div>

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

                  {/* Button */}
                  <div className="mt-auto flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = `/job-details?id=${job._id}`;
                      }}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Jobs */}
          {!jobsLoading && !jobsError && jobs.length > 0 && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/jobs";
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                View All Jobs
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
