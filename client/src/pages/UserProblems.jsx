import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProblems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1])).id;

  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await api.get("/api/problems");
      setAllProblems(res.data);
    };

    const fetchSolved = async () => {
      const res = await api.get(`/api/submissions/user/${userId}/solved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSolvedProblems(res.data);
    };

    fetchProblems();
    fetchSolved();
  }, []);

  // Collect all unique topics and companies for filter dropdowns
  const allTopics = Array.from(new Set(allProblems.flatMap(p => p.topics || [])));
  const allCompanies = Array.from(new Set(allProblems.flatMap(p => p.companyTags || [])));

  // Filter problems based on selected filters
  const filtered = allProblems.filter((p) => {
    const matchSolved = filter === "all" ? true : filter === "solved" ? solvedProblems.includes(p._id) : !solvedProblems.includes(p._id);
    const matchDifficulty = difficulty ? p.difficulty === difficulty : true;
    const matchTopic = topic ? (p.topics || []).includes(topic) : true;
    const matchCompany = company ? (p.companyTags || []).includes(company) : true;
    return matchSolved && matchDifficulty && matchTopic && matchCompany;
  });

  return (
    <div className="p-6 min-h-screen bg-slate-100">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">🧩 Practice Problems</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <button onClick={() => setFilter("all")} className={`btn ${filter === "all" ? "bg-indigo-600 text-white" : ""}`}>All</button>
        <button onClick={() => setFilter("solved")} className={`btn ${filter === "solved" ? "bg-green-600 text-white" : ""}`}>Solved</button>
        <button onClick={() => setFilter("unsolved")} className={`btn ${filter === "unsolved" ? "bg-red-500 text-white" : ""}`}>Unsolved</button>
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
        {(filter !== "all" || difficulty || topic || company) && (
          <button
            onClick={() => { setFilter("all"); setDifficulty(""); setTopic(""); setCompany(""); }}
            className="px-3 py-2 bg-slate-200 rounded-md text-slate-700 hover:bg-slate-300"
          >
            Clear Filters
          </button>
        )}
      </div>
      <ul className="space-y-4">
        {filtered.map((problem) => (
          <li
            key={problem._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-indigo-50 border border-slate-200"
            onClick={() => navigate(`/problems/${problem._id}`)}
          >
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">{problem.title}</h3>
              <p className="text-sm text-gray-600">{problem.difficulty} • {problem.topics?.join(", ")}</p>
            </div>
            <span className={`font-medium ${solvedProblems.includes(problem._id) ? "text-green-600" : "text-red-500"}`}>
              {solvedProblems.includes(problem._id) ? "Solved" : "Unsolved"}
            </span>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-slate-400 text-center py-4">No problems found.</li>}
      </ul>
    </div>
  );
};

export default UserProblems;
