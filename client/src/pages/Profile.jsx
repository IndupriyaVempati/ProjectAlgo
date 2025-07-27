import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [solvedCount, setSolvedCount] = useState(0);

  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  };

  const fetchCounts = async (userId) => {
    try {
      if (role === "admin") {
        const res = await api.get("/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCount(res.data.length);
      } else {
        // Use the userId parameter instead of user._id from state
        const res = await api.get(`/api/submissions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCount(res.data.pagination?.total || res.data.total || res.data.length || 0);
      }
    } catch (err) {
      console.error("Error fetching count:", err);
      setCount(0);
    }
  };

  const fetchSolvedCount = async (userId) => {
    try {
      const res = await api.get(`/api/submissions/user/${userId}/solved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSolvedCount(res.data.count || 0);
    } catch (err) {
      setSolvedCount(0);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const userData = await fetchUserProfile();
      if (userData && userData._id) {
        await fetchCounts(userData._id);
        if (role !== "admin") {
          await fetchSolvedCount(userData._id);
        }
      }
      setLoading(false);
    };
    
    if (token) {
      loadData();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">👤 Profile</h2>
        <p className="text-lg mb-2 text-gray-800">
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p className="text-lg mb-2 text-gray-800">
          <span className="font-semibold">Role:</span> {role}
        </p>
        <p className="text-lg mb-4 text-gray-800">
          <span className="font-semibold">Email:</span> {email}
        </p>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading...</p>
        ) : role === "admin" ? (
          <p className="text-indigo-600 text-lg">
            🧩 Problems Added: <span className="font-bold">{count}</span>
          </p>
        ) : (
          <>
            <p className="text-indigo-600 text-lg">
              🧠 Submissions Made: <span className="font-bold">{count}</span>
            </p>
            <p className="text-green-600 text-lg mt-2">
              ✅ Problems Solved: <span className="font-bold">{solvedCount}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
