import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, EyeOff, Clock, AlertTriangle, Copy } from 'lucide-react';

const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_URL}/api/submissions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSubmission(res.data.submission);
      } else {
        setError("Submission not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch submission details");
    }
    setLoading(false);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'AC': return 'text-green-600 bg-green-50 border-green-200';
      case 'WA': return 'text-red-600 bg-red-50 border-red-200';
      case 'TLE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MLE': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'RE': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'CE': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'PE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVerdictLabel = (verdict) => {
    switch (verdict) {
      case 'AC': return 'Accepted';
      case 'WA': return 'Wrong Answer';
      case 'TLE': return 'Time Limit Exceeded';
      case 'MLE': return 'Memory Limit Exceeded';
      case 'RE': return 'Runtime Error';
      case 'CE': return 'Compilation Error';
      case 'PE': return 'Presentation Error';
      default: return verdict;
    }
  };

  const total = submission?.totalTestCases || 0;
  const passed = submission?.passedTestCases || 0;
  const testCaseLength = Array.isArray(submission?.testCaseResults)
    ? submission.testCaseResults.length
    : 0;
  const hidden = submission?.hasHiddenTestcases ? total - testCaseLength : 0;
  const failed = total - passed;
  const percent = total ? Math.round((passed / total) * 100) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!submission) return <div className="text-center py-8">Submission not found</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 text-indigo-600 hover:text-indigo-800 transition"
        >
          ← Back to Submissions
        </button>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Submission Details</h1>
            <p className="text-gray-600 mt-1">
              Submitted on {new Date(submission.submissionTime).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-lg font-semibold border ${getVerdictColor(submission.verdict)}`}>
              {getVerdictLabel(submission.verdict)}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Info */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-xl font-semibold mb-3">Problem Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Link
              to={`/problems/${submission.problemId?._id}`}
              className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              {submission.problemId?.title || "Unknown Problem"}
            </Link>
            <p className="text-gray-600 mt-1">
              Difficulty: <span className="font-semibold">{submission.problemId?.difficulty}</span>
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Language: <strong>{submission.language.toUpperCase()}</strong></p>
            <p>User: <strong>{submission.userId?.username || submission.userId?.email}</strong></p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-xl font-semibold mb-4">Results Summary</h2>
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-6 h-6" /> {passed}</span>
            <span className="text-sm text-gray-600">Passed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-600 flex items-center gap-1"><XCircle className="w-6 h-6" /> {failed}</span>
            <span className="text-sm text-gray-600">Failed</span>
          </div>
          {hidden > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-500 flex items-center gap-1"><EyeOff className="w-6 h-6" /> {hidden}</span>
              <span className="text-sm text-gray-600">Hidden</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-gray-800">{total}</span>
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="text-xs text-center text-gray-500 mt-1">{percent}% Passed</div>
          </div>
        </div>
      </div>

      {/* Compilation Error */}
      {submission.compilationError && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-3">Compilation Error</h2>
          <pre className="bg-red-100 p-4 rounded-md text-sm overflow-x-auto text-red-700">
            {submission.compilationError}
          </pre>
        </div>
      )}

      {/* Test Case Results */}
      {submission.testCaseResults && submission.testCaseResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Case Results</h2>
          {submission.hasHiddenTestcases && (
            <div className="mb-4 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <EyeOff className="inline w-4 h-4 mr-1" /> Some test cases are hidden and not shown here. Your code was evaluated against all test cases.
            </div>
          )}
          <div className="space-y-3">
            {submission.testCaseResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 ${result.status === 'AC' ? 'border-green-200 bg-green-50' : result.status === 'WA' ? 'border-red-200 bg-red-50' : result.status === 'TLE' ? 'border-yellow-200 bg-yellow-50' : result.status === 'MLE' ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Test Case #{index + 1}</span>
                  {result.status === 'AC' && <CheckCircle className="text-green-500 w-5 h-5" />}
                  {result.status === 'WA' && <XCircle className="text-red-500 w-5 h-5" />}
                  {result.status === 'TLE' && <Clock className="text-yellow-500 w-5 h-5" />}
                  {result.status === 'MLE' && <AlertTriangle className="text-purple-500 w-5 h-5" />}
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${result.status === 'AC' ? 'bg-green-100 text-green-700' : result.status === 'WA' ? 'bg-red-100 text-red-700' : result.status === 'TLE' ? 'bg-yellow-100 text-yellow-700' : result.status === 'MLE' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{getVerdictLabel(result.status)}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  {result.runtime && <span>Runtime: {result.runtime}ms</span>}
                  {result.memory && <span>Memory: {result.memory.toFixed(1)}MB</span>}
                </div>
                {result.errorMessage && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600 mb-1">Error:</p>
                    <pre className="bg-red-50 p-2 rounded text-sm text-red-700 overflow-x-auto">{result.errorMessage}</pre>
                  </div>
                )}
                {result.status === 'WA' && result.output && result.expectedOutput && (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Your Output:</p>
                      <pre className="bg-red-50 p-2 rounded text-sm overflow-x-auto border border-red-200">{result.output}</pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Expected Output:</p>
                      <pre className="bg-green-50 p-2 rounded text-sm overflow-x-auto border border-green-200">{result.expectedOutput}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Code */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Submitted Code</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              {showCode ? "Hide Code" : "Show Code"}
            </button>
            {showCode && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center gap-1"
              >
                <Copy className="w-4 h-4" /> {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>
        {showCode && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2 text-sm text-gray-600">
              Language: <strong>{submission.language.toUpperCase()}</strong>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {submission.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetail;
