import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from 'react-simple-code-editor';
import { highlight, languages as prismLanguages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import { toast } from 'react-toastify';

const LANGUAGES = [
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
  { label: "Java", value: "java" },
];

const DEFAULT_CODE = {
  python: "# Write your Python code here\n",
  cpp: "// Write your C++ code here\n#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}",
  c: "// Write your C code here\n#include <stdio.h>\nint main() {\n    return 0;\n}",
  java: "// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n    }\n}",
};

const languageToPrism = {
  python: prismLanguages.python,
  cpp: prismLanguages.cpp || prismLanguages.clike,
  c: prismLanguages.c || prismLanguages.clike,
  java: prismLanguages.java || prismLanguages.clike,
};

// Keep all your imports the same...

const ProblemSolve = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_REACT_URL}/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblem(res.data);
        fetchUserSubmissions();
      } catch (err) {
        setError("Failed to fetch problem");
      }
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    setCode(DEFAULT_CODE[language]);
  }, [language]);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("");
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/run";
      const payload = { language, code, input };
      const { data } = await axios.post(backendUrl, payload);
      setOutput(data.output || data.error || "No output");
    } catch (error) {
      if (error.response) {
        setOutput(`Error: ${error.response.data.error || 'Server error occurred'}`);
      } else if (error.request) {
        setOutput('Error: Could not connect to server.');
      } else {
        setOutput(`Error: ${error.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || !code.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;
      if (!userId) {
        setOutput("Error: Please login to submit code");
        return;
      }
      const payload = { userId, problemId: id, code, language };
      const { data } = await axios.post(`${import.meta.env.VITE_REACT_URL}/api/submissions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setLastSubmission(data.submission);
        setOutput(`Submission successful! Verdict: ${data.submission.verdict}\nScore: ${data.submission.score}/${data.submission.totalScore}\nPassed: ${data.submission.passedTestCases}/${data.submission.totalTestCases} test cases`);
        fetchUserSubmissions();
      } else {
        setOutput(`Submission failed: ${data.error}`);
      }
    } catch (error) {
      if (error.response) {
        setOutput(`Submission Error: ${error.response.data.error || 'Server error occurred'}`);
      } else {
        setOutput('Error: Could not connect to server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUserSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;
      if (!userId) return;

      const { data } = await axios.get(`${import.meta.env.VITE_REACT_URL}/api/submissions/user/${userId}?problemId=${id}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The backend returns { data: submissions, pagination: {...} }
      if (data && data.data) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500">Loading problem...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-red-100 p-4 rounded text-red-600 shadow">{error || "Problem not found."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
      {/* Left Section: Problem Details */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-2xl font-bold text-indigo-600">{problem.title}</h1>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-indigo-100 text-indigo-600 px-2 py-1 text-xs rounded">{problem.difficulty}</span>
          {problem.topics?.map((tag, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 text-xs rounded">{tag}</span>
          ))}
          {problem.companyTags?.map((company, idx) => (
            <span key={idx} className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded">{company}</span>
          ))}
        </div>
        <div className="prose max-w-none text-sm whitespace-pre-wrap">{problem.description}</div>
        {problem.constraints && (
          <div className="text-xs text-gray-600"><strong>Constraints:</strong> {problem.constraints}</div>
        )}
        {problem.hints?.length > 0 && (
          <div className="text-xs text-gray-600"><strong>Hints:</strong> {problem.hints.join(", ")}</div>
        )}
        {problem.sampleInputs?.length > 0 && (
          <div className="text-xs text-gray-600">
            <strong>Sample Inputs:</strong>
            <ul className="list-disc pl-5">{problem.sampleInputs.map((inp, i) => <li key={i}><pre>{inp}</pre></li>)}</ul>
          </div>
        )}
        {problem.sampleOutputs?.length > 0 && (
          <div className="text-xs text-gray-600">
            <strong>Sample Outputs:</strong>
            <ul className="list-disc pl-5">{problem.sampleOutputs.map((out, i) => <li key={i}><pre>{out}</pre></li>)}</ul>
          </div>
        )}
      </div>

      {/* Right Section: Code Editor, Input/Output, Review */}
      <div className="space-y-4">
        {/* Code Editor */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between mb-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              {LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
            </select>
            <div className="space-x-2">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`px-3 py-1 text-sm rounded ${isRunning ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-3 py-1 text-sm rounded ${isSubmitting ? 'bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              highlight(code, languageToPrism[language] || prismLanguages.text, language)
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: '300px',
            }}
          />
        </div>

        {/* Input / Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-3 rounded shadow text-sm border"
            placeholder="Input here..."
          />
          <pre className="bg-gray-100 p-3 rounded shadow text-sm whitespace-pre-wrap">
            {output || "Run code to see output..."}
          </pre>
        </div>

        {/* Last Submission */}
        {lastSubmission && (
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Last Submission</h4>
            <div className="text-sm space-y-1">
              <div>Status: <span className={`font-semibold ${lastSubmission.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>{lastSubmission.verdict}</span></div>
              <div>Score: {lastSubmission.score}/{lastSubmission.totalScore}</div>
              <div>Test Cases: {lastSubmission.passedTestCases}/{lastSubmission.totalTestCases}</div>
            </div>
          </div>
        )}

{/* Submission History */}
        {submissions.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Submission History</h4>
            {submissions.map((s, idx) => (
              <div key={idx} className="text-sm border-b last:border-b-0 py-1">
                <span className={`font-semibold ${s.verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>{s.verdict}</span>
                <span className="ml-2 text-gray-500 text-xs">at {new Date(s.submissionTime).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolve;
