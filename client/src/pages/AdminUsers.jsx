import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [userSubmissionCounts, setUserSubmissionCounts] = useState({});

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
      // Fetch submission counts for each user
      const counts = {};
      await Promise.all(
        res.data.map(async (user) => {
          if (user.role !== "admin") {
            const subRes = await api.get(`/api/submissions/user/${user._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            counts[user._id] = subRes.data.length;
          }
        })
      );
      setUserSubmissionCounts(counts);
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

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.role !== "admin" &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <ul className="space-y-3">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`cursor-pointer hover:bg-indigo-50 p-3 rounded-xl flex flex-col gap-1 border border-slate-100 ${selectedUser && selectedUser._id === user._id ? "ring-2 ring-indigo-400" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{user.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>{user.role}</span>
                </div>
                <span className="text-xs text-slate-500">{user.email}</span>
                <span className="text-xs text-indigo-600 font-semibold">Submissions: {userSubmissionCounts[user._id] ?? "-"}</span>
              </li>
            ))}
            {filteredUsers.length === 0 && <li className="text-slate-400 text-center py-4">No users found.</li>}
          </ul>
        </div>
        {/* Selected User Details & Submissions */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200 min-h-[300px]">
          {selectedUser ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-indigo-700 mb-1 flex items-center gap-2">
                  {selectedUser.name}
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedUser.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"}`}>{selectedUser.role}</span>
                </h2>
                <div className="text-slate-600 text-sm mb-1">{selectedUser.email}</div>
                <div className="text-slate-500 text-xs mb-2">User ID: <span className="font-mono select-all">{selectedUser._id}</span></div>
                <div className="text-indigo-600 text-sm font-semibold mb-2">Total Submissions: {userSubmissionCounts[selectedUser._id] ?? "-"}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Submissions</h3>
                {loading ? (
                  <p className="text-slate-500">Loading submissions...</p>
                ) : (
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {submissions.length > 0 ? (
                      submissions.map((sub) => (
                        <li key={sub._id} className="bg-indigo-50 p-2 rounded text-xs">
                          <p><strong>Problem:</strong> {sub.problemId}</p>
                          <p><strong>Language:</strong> {sub.language}</p>
                          <p><strong>Verdict:</strong> {sub.verdict || "-"}</p>
                          <p><strong>Time:</strong> {sub.submissionTime ? new Date(sub.submissionTime).toLocaleString() : "-"}</p>
                          <p><strong>Code:</strong> <code className="break-words">{sub.code}</code></p>
                        </li>
                      ))
                    ) : (
                      <p className="text-slate-500">No submissions found.</p>
                    )}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-center py-10">Select a user to view details and submissions.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
