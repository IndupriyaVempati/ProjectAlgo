import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [count, setCount] = useState(0);

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
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchCounts = async () => {
    try {
      if (role === "admin") {
        const res = await api.get("/api/problems", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCount(res.data.length);
      } else {
        const userId = JSON.parse(atob(token.split(".")[1])).id;
        const res = await api.get(`/api/submissions/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCount(res.data.length);
      }
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCounts();
  }, []);

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

        {role === "admin" ? (
          <p className="text-indigo-600 text-lg">
            🧩 Problems Added: <span className="font-bold">{count}</span>
          </p>
        ) : (
          <p className="text-indigo-600 text-lg">
            🧠 Submissions Made: <span className="font-bold">{count}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
