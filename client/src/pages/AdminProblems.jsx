import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProblems = () => {
  const api = axios.create({ baseURL: import.meta.env.VITE_REACT_URL });
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Problem List</h1>
      <ul className="space-y-4">
        {problems.map((p) => (
          <li key={p._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-600">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.difficulty}</p>
              </div>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProblems;
