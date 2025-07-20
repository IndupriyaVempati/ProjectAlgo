import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/submissions/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">All Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white rounded-md shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Registered Users</h2>
          <ul className="space-y-3">
          
            {users.filter(user => user.role !== 'admin').map((user) => (

              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="cursor-pointer hover:bg-indigo-50 p-2 rounded-md flex justify-between"
              >
                <span className="text-slate-800">{user.name}</span>
                <span className="text-sm text-slate-500">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected User Submissions */}
        <div className="bg-white rounded-md shadow p-4">
          <h2 className="text-lg font-semibold mb-3">
            {selectedUser ? `${selectedUser.name}'s Submissions` : "Select a user"}
          </h2>
          {loading ? (
            <p className="text-slate-500">Loading submissions...</p>
          ) : (
            <ul className="space-y-2">
              {submissions.length > 0 ? (
                submissions.map((sub) => (
                  <li key={sub._id} className="bg-indigo-50 p-2 rounded text-sm">
                    <p><strong>Problem:</strong> {sub.problemId}</p>
                    <p><strong>Language:</strong> {sub.language}</p>
                    <p><strong>Code:</strong> <code className="break-words">{sub.code}</code></p>
                  </li>
                ))
              ) : (
                selectedUser && <p className="text-slate-500">No submissions found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
