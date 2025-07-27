import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProblems = () => {
  const api = axios.create({ baseURL: import.meta.env.VITE_REACT_URL });
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/problems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(res.data);
    } catch (err) {
      setError("Failed to fetch problems");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProblems();
    } catch (err) {
      setError("Failed to delete problem");
    }
    setLoading(false);
  };

  // Collect all unique topics and companies for filter dropdowns
  const allTopics = Array.from(new Set(problems.flatMap(p => p.topics || [])));
  const allCompanies = Array.from(new Set(problems.flatMap(p => p.companyTags || [])));

  // Filter problems based on selected filters
  const filteredProblems = problems.filter(p => {
    const matchDifficulty = difficulty ? p.difficulty === difficulty : true;
    const matchTopic = topic ? (p.topics || []).includes(topic) : true;
    const matchCompany = company ? (p.companyTags || []).includes(company) : true;
    return matchDifficulty && matchTopic && matchCompany;
  });

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Problem List</h1>
        <button
          onClick={() => navigate("/admin/problems/add")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow"
        >
          + Add Problem
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
        >
          <option value="">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
        >
          <option value="">All Topics</option>
          {allTopics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-700"
        >
          <option value="">All Companies</option>
          {allCompanies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {(difficulty || topic || company) && (
          <button
            onClick={() => { setDifficulty(""); setTopic(""); setCompany(""); }}
            className="px-3 py-2 bg-slate-200 rounded-md text-slate-700 hover:bg-slate-300"
          >
            Clear Filters
          </button>
        )}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-4">
        {filteredProblems.map((p) => (
          <li key={p._id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between border border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-indigo-600">{p.title}</h3>
              <div className="flex flex-wrap gap-2 text-xs mb-1">
                <span className={`px-2 py-1 rounded bg-indigo-50 text-indigo-600 font-semibold`}>{p.difficulty}</span>
                {p.topics && p.topics.map((topic, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-100 text-slate-500">{topic}</span>
                ))}
                {p.companyTags && p.companyTags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-emerald-50 text-emerald-600">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => navigate(`/admin/problems/edit/${p._id}`)}
                className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/admin/problems/${p._id}/testcases`)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
              >
                Testcases
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProblems;
