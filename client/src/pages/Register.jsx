import React, { useState, useRef } from "react";
import { useNavigate, NavLink} from "react-router-dom";
import axios from "axios";

const Register = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  const navigate = useNavigate();
  const errorRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.isAdmin ? "admin" : "user",
      });

      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(msg);

      // scroll to error if needed
      setTimeout(() => {
        if (errorRef.current) errorRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md relative">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
          Join the Challenge 🚀
        </h2>
        <p className="text-center text-slate-600 mb-6 text-sm">
          Solve problems. Track progress. Master DSA. Begin your coding journey!
        </p>

        {error && (
          <p
            ref={errorRef}
            className="bg-red-100 border border-red-400 text-red-600 text-sm px-4 py-2 rounded mb-4 text-center"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-800 placeholder:text-slate-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-800 placeholder:text-slate-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-800 placeholder:text-slate-400"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            <label htmlFor="isAdmin" className="text-sm text-slate-700">
              Register as Admin (only if no admin exists)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold rounded-md transition`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          Already a member?{" "}
          <NavLink
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
