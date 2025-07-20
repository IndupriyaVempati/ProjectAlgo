import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProblems = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filter, setFilter] = useState("all");

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

  const filtered = allProblems.filter((p) => {
    if (filter === "solved") return solvedProblems.includes(p._id);
    if (filter === "unsolved") return !solvedProblems.includes(p._id);
    return true; // 'all'
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">🧩 Practice Problems</h1>

      <div className="flex gap-3 mb-5">
        <button onClick={() => setFilter("all")} className="btn">All</button>
        <button onClick={() => setFilter("solved")} className="btn">Solved</button>
        <button onClick={() => setFilter("unsolved")} className="btn">Unsolved</button>
      </div>

      <ul className="space-y-4">
        {filtered.map((problem) => (
          <li
            key={problem._id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
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
      </ul>
    </div>
  );
};

export default UserProblems;
