import { useEffect, useState } from "react";

function RecruiterDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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
