import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AIInterviewPrep() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // =========================
  // FETCH AVAILABLE JOBS
  // =========================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        setError("");

        const response = await fetch(`${API_URL}/api/jobs`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Fetch jobs error:", error);
        setError(error.message || "Unable to load jobs");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // =========================
  // GENERATE INTERVIEW PREP
  // =========================
  const handleGenerate = async () => {
    if (!selectedJobId) {
      setError("Please select a job first.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setResult(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login before using AI Interview Preparation.");
        return;
      }

      const selected = jobs.find((job) => job._id === selectedJobId);

      const response = await fetch(`${API_URL}/api/ai/interview-prep`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate interview preparation",
        );
      }

      setSelectedJob(selected || data.job || null);
      setResult(data.result);
    } catch (error) {
      console.error("Interview preparation error:", error);
      setError(error.message || "Unable to generate interview preparation");
    } finally {
      setGenerating(false);
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
              AI Interview Preparation
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
      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Intro */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl">
              🤖
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                AI Interview Preparation
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select a job and let AI generate technical, HR and job-specific
                interview questions based on the opportunity.
              </p>
            </div>
          </div>

          {/* Job Selection */}
          <div className="mt-7 border-t border-slate-100 pt-6">
            <label
              htmlFor="job"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Select Job
            </label>

            {loadingJobs ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Loading available jobs...
              </div>
            ) : (
              <select
                id="job"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setError("");
                  setResult(null);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Choose a job</option>

                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || loadingJobs || !selectedJobId}
              className="mt-5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating
                ? "Generating Questions..."
                : "Generate Interview Questions"}
            </button>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Selected Job */}
        {result && selectedJob && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Interview Preparation For
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {selectedJob.title}
            </h2>

            <p className="mt-1 text-sm font-semibold text-blue-600">
              {selectedJob.company}
            </p>
          </section>
        )}

        {/* Questions */}
        {result?.questions?.length > 0 && (
          <section className="mt-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Interview Questions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Practice these AI-generated questions before your interview.
              </p>
            </div>

            <div className="space-y-4">
              {result.questions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Question {index + 1}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {item.category}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {item.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-6 text-slate-900">
                    {item.question}
                  </h3>

                  <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Answer Hint
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.answerHint}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Preparation Tips */}
        {result?.preparationTips?.length > 0 && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                AI Preparation Tips
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Practical suggestions to help you prepare.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {result.preparationTips.map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                    {index + 1}
                  </div>

                  <p className="pt-1 text-sm leading-6 text-slate-600">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AIInterviewPrep;
