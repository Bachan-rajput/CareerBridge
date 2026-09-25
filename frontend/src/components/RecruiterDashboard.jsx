import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function RecruiterDashboard() {
  const [user, setUser] = useState(null);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // =========================
  // FETCH RECRUITER ANALYTICS
  // =========================
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        setAnalyticsError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setAnalyticsError("Please login again.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/applications/recruiter/analytics`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch recruiter analytics",
          );
        }

        setAnalytics(data.analytics);
      } catch (error) {
        console.error("Recruiter analytics error:", error);

        setAnalyticsError(
          error.message || "Unable to load recruiter analytics",
        );
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, []);

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
              Recruiter Dashboard
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
                  {user?.name?.charAt(0)?.toUpperCase() || "R"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                    Welcome, {user?.name || "Recruiter"} 👋
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your job postings and review applications from
                    candidates.
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
                  {user?.role || "Recruiter"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            RECRUITER ANALYTICS
        ========================= */}
        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Recruitment Analytics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your jobs and candidate applications.
            </p>
          </div>

          {loadingAnalytics ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Loading recruitment analytics...
              </p>
            </div>
          ) : analyticsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-700">
                {analyticsError}
              </p>
            </div>
          ) : analytics ? (
            <>
              {/* Analytics Cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Jobs */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Total Jobs
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.totalJobs}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
                      💼
                    </div>
                  </div>
                </div>

                {/* Total Applications */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Total Applications
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.totalApplications}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
                      📄
                    </div>
                  </div>
                </div>

                {/* Applied */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Applied
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.applied}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      📝
                    </div>
                  </div>
                </div>

                {/* Shortlisted */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Shortlisted
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.shortlisted}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
                      ⭐
                    </div>
                  </div>
                </div>

                {/* Interview */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Interview
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.interview}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      🎯
                    </div>
                  </div>
                </div>

                {/* Selected */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Selected
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.selected}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
                      ✅
                    </div>
                  </div>
                </div>

                {/* Rejected */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Rejected
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {analytics.rejected}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ❌
                    </div>
                  </div>
                </div>
              </div>

              {/* Job-wise Applications */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Job-wise Applications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Applications received for each job posting.
                  </p>
                </div>

                {analytics.jobWiseApplications?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Job
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Company
                          </th>

                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Applications
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {analytics.jobWiseApplications.map((job) => (
                          <tr
                            key={job.jobId}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {job.title}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-600">
                                {job.company}
                              </p>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                {job.applications}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-sm text-slate-500">
                      No job postings available.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>

        {/* Quick Actions */}
        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your recruitment activities.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Post Job */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
                📢
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Post a Job
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                Create and publish a new job or internship opportunity.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/post-job";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Post Job
              </button>
            </div>

            {/* My Jobs */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                💼
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                My Jobs
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                View and manage the jobs you have posted.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/my-jobs";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                My Jobs
              </button>
            </div>

            {/* Applications */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                📄
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Applications
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                Review applications received for your job postings.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/received-applications";
                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Applications
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;
