import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    skills: "",
    experience: "Fresher",
    applicationDeadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          description: formData.description,
          location: formData.location,
          jobType: formData.jobType,
          salary: formData.salary,
          skills: skillsArray,
          experience: formData.experience,
          applicationDeadline: formData.applicationDeadline || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post job");
      }

      setMessage("Job posted successfully!");

      setFormData({
        title: "",
        company: "",
        description: "",
        location: "",
        jobType: "Full-time",
        salary: "",
        skills: "",
        experience: "Fresher",
        applicationDeadline: "",
      });
    } catch (error) {
      console.error("Post job error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
              Post a Job
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
      <main className="mx-auto max-w-4xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Page Heading */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Create a Job Posting
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the details of the job or internship opportunity.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Job Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Provide accurate information so candidates can understand the
              opportunity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Job Title + Company */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Job Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. MERN Stack Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Job Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                placeholder="Describe the role, responsibilities and requirements..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Location + Job Type */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Remote / Meerut / Delhi"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="jobType"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Job Type
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Salary + Experience */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="salary"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Salary
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="e.g. ₹15,000 / month"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Experience
                </label>

                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3+ years">3+ years</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Required Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="React, Node.js, MongoDB, Express.js"
                value={formData.skills}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate multiple skills with commas (e.g. React, Node.js).
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="applicationDeadline"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Application Deadline
              </label>

              <input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-700">{message}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Posting Job..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Make sure all job information is accurate before publishing.
        </p>
      </main>
    </div>
  );
}

export default PostJob;
