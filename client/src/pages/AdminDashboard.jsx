import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ["#4f46e5", "#22d3ee", "#f59e42", "#f43f5e", "#10b981", "#6366f1", "#fbbf24", "#a21caf"];

const AdminDashboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [topProblems, setTopProblems] = useState([]);
  const [verdictStats, setVerdictStats] = useState([]);
  const [langStats, setLangStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_URL,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching dashboard stats...");
      
      // Fetch top performers
      const usersRes = await api.get(`/api/stats/top-users`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      console.log("Top users response:", usersRes.data);
      setTopUsers(usersRes.data.topUsers || []);
      
      // Fetch top problems
      const probsRes = await api.get(`/api/stats/top-problems`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      console.log("Top problems response:", probsRes.data);
      setTopProblems(probsRes.data.topProblems || []);
      
      // Fetch verdict stats
      const verdictRes = await api.get(`/api/stats/verdicts`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      console.log("Verdict stats response:", verdictRes.data);
      setVerdictStats(verdictRes.data.verdicts || []);
      
      // Fetch language stats
      const langRes = await api.get(`/api/stats/languages`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      console.log("Language stats response:", langRes.data);
      setLangStats(langRes.data.languages || []);
      
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.response?.data?.error || err.message || "Failed to fetch dashboard data");
      // fallback: set empty arrays
      setTopUsers([]);
      setTopProblems([]);
      setVerdictStats([]);
      setLangStats([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Admin Dashboard</h1>
      {loading ? (
        <div className="text-center py-12 text-lg text-gray-500">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">Error loading dashboard</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={fetchDashboardStats}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Top Performers</h2>
            {Array.isArray(topUsers) && topUsers.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsers} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="acCount" fill="#4f46e5">
                    {topUsers?.map?.((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-8">No data available</div>
            )}
          </div>
          {/* Top Problems */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Top Problems</h2>
            {Array.isArray(topProblems) && topProblems.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProblems} margin={{ left: 20, right: 20 }}>
                  <XAxis dataKey="title" interval={0} angle={-20} textAnchor="end" height={80} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="solvedCount" fill="#10b981">
                    {topProblems?.map?.((entry, idx) => (
                      <Cell key={`cell-prob-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-8">No data available</div>
            )}
          </div>
          {/* Verdict Distribution */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Verdict Distribution</h2>
            {Array.isArray(verdictStats) && verdictStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={verdictStats} dataKey="count" nameKey="verdict" cx="50%" cy="50%" outerRadius={100} label>
                    {verdictStats?.map?.((entry, idx) => (
                      <Cell key={`cell-verdict-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-8">No data available</div>
            )}
          </div>
          {/* Language Usage */}
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Language Usage</h2>
            {Array.isArray(langStats) && langStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={langStats} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={100} label>
                    {langStats?.map?.((entry, idx) => (
                      <Cell key={`cell-lang-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-8">No data available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 