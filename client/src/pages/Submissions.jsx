import React, { useEffect, useState } from "react";
import axios from "axios";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const res = await axios.get(`${import.meta.env.VITE_REACT_URL}/api/submissions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to fetch submissions");
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">My Submissions</h1>
      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="text-slate-400">No submissions found.</div>
      ) : (
        <ul className="space-y-4">
          {submissions.map((sub) => (
            <li key={sub._id} className="bg-white p-4 rounded shadow border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-indigo-700 font-semibold">Problem: {sub.problemId}</div>
                  <div className="text-xs text-slate-500">Language: {sub.language}</div>
                  <div className="text-xs text-slate-500">Verdict: <span className={sub.verdict === "Accepted" ? "text-green-600" : "text-red-500"}>{sub.verdict || "-"}</span></div>
                  <div className="text-xs text-slate-400">{sub.submissionTime ? new Date(sub.submissionTime).toLocaleString() : "-"}</div>
                </div>
                <div className="overflow-x-auto max-w-full">
                  <code className="block bg-slate-50 p-2 rounded text-xs text-slate-700 whitespace-pre-wrap break-words max-w-xs md:max-w-md lg:max-w-lg">{sub.code}</code>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Submissions; 