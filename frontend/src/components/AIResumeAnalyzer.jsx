import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AIResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please select a PDF file only.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("PDF size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select your resume PDF first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before analyzing your resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_URL}/api/ai/resume-analyze-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      setResult(data.result);
    } catch (error) {
      console.error("Resume analysis error:", error);
      setError(error.message || "Unable to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Career<span className="text-blue-600">Bridge</span>
            </h1>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              AI Resume Analyzer
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:py-10">
        {/* Intro */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ✦
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Analyze Your Resume with AI
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Upload your resume PDF and get an AI-generated score, detected
                skills, strengths, weaknesses, and practical improvement
                suggestions.
              </p>
            </div>
          </div>

          {/* Upload */}
          <div className="mt-8">
            <label
              htmlFor="resume-upload"
              className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                📄
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800">
                Click to upload your resume
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF only · Maximum 5 MB
              </p>

              <input
                id="resume-upload"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-600">
                  PDF
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="w-fit text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        </section>

        {/* Results */}
        {result && (
          <section className="mt-6 space-y-6">
            {/* Score */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    AI Resume Score
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {result.resumeScore}
                    <span className="text-lg text-slate-400">/100</span>
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Based on the content and presentation of your resume.
                  </p>
                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-blue-100 text-xl font-bold text-blue-600">
                  {result.resumeScore}%
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Detected Skills
              </h3>

              {result.detectedSkills?.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.detectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No specific skills were detected.
                </p>
              )}
            </div>

            {/* Strengths + Weaknesses */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Strengths
                </h3>

                <ul className="mt-4 space-y-3">
                  {result.strengths?.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 text-green-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Areas to Improve
                </h3>

                <ul className="mt-4 space-y-3">
                  {result.weaknesses?.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 text-amber-600">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                AI Improvement Suggestions
              </h3>

              <div className="mt-4 space-y-3">
                {result.suggestions?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600"
                  >
                    <span className="mr-2 font-semibold text-blue-600">
                      {index + 1}.
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                AI Summary
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {result.summary}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AIResumeAnalyzer;
