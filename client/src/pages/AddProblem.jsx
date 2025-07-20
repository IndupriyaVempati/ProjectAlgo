import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const defaultProblem = {
  title: "",
  companyTags: [],
  difficulty: "Easy",
  topics: [],
  description: "",
  constraints: "",
  hints: [],
  sampleInputs: [],
  sampleOutputs: [],
};

const AddProblem = () => {
  const [form, setForm] = useState(defaultProblem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["companyTags", "topics", "hints"].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value.split(",").map((v) => v.trim()).filter(Boolean) }));
    } else if (name === "sampleInputs" || name === "sampleOutputs") {
      setForm((prev) => ({ ...prev, [name]: value.split("\n").map((v) => v.trim()).filter(Boolean) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_REACT_URL}/api/problems`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/api/problems");
    } catch (err) {
      setError("Failed to add problem");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative border border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Add Problem</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            name="companyTags"
            placeholder="Company Tags (comma separated)"
            value={form.companyTags.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400"
          />
          <input
            type="text"
            name="topics"
            placeholder="Topics (comma separated)"
            value={form.topics.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 min-h-[80px]"
          />
          <input
            type="text"
            name="constraints"
            placeholder="Constraints"
            value={form.constraints}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400"
          />
          <input
            type="text"
            name="hints"
            placeholder="Hints (comma separated)"
            value={form.hints.join(", ")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400"
          />
          <textarea
            name="sampleInputs"
            placeholder="Sample Inputs (one per line)"
            value={form.sampleInputs.join("\n")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 min-h-[60px]"
          />
          <textarea
            name="sampleOutputs"
            placeholder="Sample Outputs (one per line)"
            value={form.sampleOutputs.join("\n")}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 min-h-[60px]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold rounded-md transition`}
          >
            {loading ? "Adding..." : "Add Problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem; 