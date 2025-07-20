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

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_REACT_URL}/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblem(res.data);
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
      const payload = {
        language,
        code,
        input,
      };
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Problem Details */}
      <div className="w-full md:w-1/2 bg-white p-8 border-r border-slate-200 min-h-[400px] flex flex-col">
        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : problem ? (
          <>
            <h1 className="text-2xl font-bold text-indigo-700 mb-2">{problem.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-semibold text-xs">{problem.difficulty}</span>
              {problem.topics && problem.topics.map((t, i) => (
                <span key={i} className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs">{t}</span>
              ))}
              {problem.companyTags && problem.companyTags.map((c, i) => (
                <span key={i} className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs">{c}</span>
              ))}
            </div>
            <div className="mb-4 text-slate-700 whitespace-pre-line text-sm">{problem.description}</div>
            {problem.constraints && <div className="mb-2 text-xs text-slate-500"><strong>Constraints:</strong> {problem.constraints}</div>}
            {problem.hints && problem.hints.length > 0 && <div className="mb-2 text-xs text-slate-500"><strong>Hints:</strong> {problem.hints.join(", ")}</div>}
            {problem.sampleInputs && problem.sampleInputs.length > 0 && (
              <div className="mb-2 text-xs text-slate-500">
                <strong>Sample Inputs:</strong>
                <ul className="list-disc ml-6">
                  {problem.sampleInputs.map((input, i) => <li key={i}><code>{input}</code></li>)}
                </ul>
              </div>
            )}
            {problem.sampleOutputs && problem.sampleOutputs.length > 0 && (
              <div className="mb-2 text-xs text-slate-500">
                <strong>Sample Outputs:</strong>
                <ul className="list-disc ml-6">
                  {problem.sampleOutputs.map((output, i) => <li key={i}><code>{output}</code></li>)}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </div>
      {/* Code Editor + Compiler */}
      <div className="w-full md:w-1/2 bg-slate-50 p-8 flex flex-col min-h-[400px]">
        <div className="flex items-center gap-4 mb-4">
          <label className="font-semibold text-slate-700">Language:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white mb-4" style={{ height: '300px', overflowY: 'auto' }}>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlight(code, languageToPrism[language] || prismLanguages.clike)}
            padding={12}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              height: '100%',
              overflowY: 'auto',
              outline: 'none',
              backgroundColor: '#f9fafb',
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Program Input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none"
            placeholder="Enter input (optional)"
          />
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.6 3.11a.375.375 0 0 1-.56-.327V8.887c0-.285.308-.465.56-.326l5.6 3.11z" />
          </svg>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <div className="p-3 h-28 bg-gray-100 border border-gray-200 rounded-md overflow-y-auto font-mono text-sm">
            {output ? output : 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve; 