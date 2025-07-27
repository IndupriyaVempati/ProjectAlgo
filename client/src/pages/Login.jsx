import React, { useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  const navigate = useNavigate();
  const errorRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      console.log("Login successful:", res.data);
      alert("Login successful!");
      navigate(res.data.user.role === "admin" ? "/admin-welcome" : "/user-welcome");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid credentials or server error.";
      setError(msg);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center px-4">
      {/* Glowing background blob */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-400 opacity-20 blur-[160px] rounded-full top-10 left-1/2 transform -translate-x-1/2 z-0"></div>

      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-3">
          Welcome Back 👋
        </h2>
        <p className="text-center text-slate-600 mb-6 text-sm">
          Continue solving problems and mastering DSA!
        </p>

        {error && (
          <p
            ref={errorRef}
            className="bg-red-100 border border-red-400 text-red-600 text-sm px-4 py-2 rounded mb-4 text-center"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-4 py-2 border border-indigo-200 rounded-md bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold rounded-md transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-5">
          New here?{" "}
          <NavLink
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          > 
            Create an account
          </NavLink>
          
        </p>
      </div>
    </div>
  );
};

export default Login;
