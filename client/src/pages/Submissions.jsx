import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, AlertTriangle, User, Code2 } from 'lucide-react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    verdict: "",
    language: "",
    page: 1,
    problemId: ""
  });
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [codeFilter, setCodeFilter] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [problems, setProblems] = useState([]);

  const verdictOptions = [
    { value: "", label: "All Verdicts" },
    { value: "AC", label: "Accepted" },
    { value: "WA", label: "Wrong Answer" },
    { value: "TLE", label: "Time Limit Exceeded" },
    { value: "MLE", label: "Memory Limit Exceeded" },
    { value: "RE", label: "Runtime Error" },
    { value: "CE", label: "Compilation Error" },
    { value: "PE", label: "Presentation Error" }
  ];

  const languageOptions = [
    { value: "", label: "All Languages" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" }
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    fetchProblems();
  }, []);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [filters, codeFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || (!user && !isAdmin)) {
        setError("Please login to view submissions");
        setLoading(false);
        return;
      }
      let url = "";
      let params = new URLSearchParams({
        page: filters.page,
        limit: 10,
        ...(filters.verdict && { verdict: filters.verdict }),
        ...(filters.language && { language: filters.language }),
        ...(filters.problemId && { problemId: filters.problemId })
      });
      if (isAdmin) {
        url = `${import.meta.env.VITE_REACT_URL}/api/submissions/admin/all?${params}`;
      } else {
        const userId = user._id || user.id;
        url = `${import.meta.env.VITE_REACT_URL}/api/submissions/user/${userId}?${params}`;
      }
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      let filtered = res.data.data || res.data.submissions || []; // Handle both structures
      if (codeFilter) {
        filtered = filtered.filter(sub => sub.code && sub.code.toLowerCase().includes(codeFilter.toLowerCase()));
      }
      setSubmissions(filtered);
      setTotalPages(res.data.pagination?.totalPages || res.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch submissions: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!token || !user) return;
      
      const userId = user._id || user.id;
      
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_URL}/api/submissions/stats?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      // Stats are optional, don't show error to user
      setStats(null);
    }
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_REACT_URL}/api/problems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(res.data);
    } catch (err) {
      setProblems([]);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'AC': return 'text-green-600 bg-green-50 border-green-200';
      case 'WA': return 'text-red-600 bg-red-50 border-red-200';
      case 'TLE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MLE': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'RE': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'CE': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'PE': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVerdictLabel = (verdict) => {
    switch (verdict) {
      case 'AC': return 'Accepted';
      case 'WA': return 'Wrong Answer';
      case 'TLE': return 'Time Limit Exceeded';
      case 'MLE': return 'Memory Limit Exceeded';
      case 'RE': return 'Runtime Error';
      case 'CE': return 'Compilation Error';
      case 'PE': return 'Presentation Error';
      default: return verdict;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading && submissions.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Submissions</h1>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
          {stats.stats.map((stat) => (
            <div key={stat._id} className="bg-white p-4 rounded-lg shadow border">
              <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
              <div className={`text-sm ${getVerdictColor(stat._id).split(' ')[0]}`}>{getVerdictLabel(stat._id)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verdict
            </label>
            <select
              value={filters.verdict}
              onChange={(e) => handleFilterChange('verdict', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {verdictOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem
            </label>
            <select
              value={filters.problemId}
              onChange={e => handleFilterChange('problemId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Problems</option>
              {problems.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Contains
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={codeFilter}
                onChange={e => setCodeFilter(e.target.value)}
                placeholder="Search code..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Code2 className="text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilters({ verdict: "", language: "", page: 1, problemId: "" }); setCodeFilter(""); }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center py-8 text-red-500">{error}</div>
      )}

      {submissions.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No submissions found. Start solving problems!
        </div>
      ) : (
        <>
          {/* Submissions List */}
          <div className="space-y-4">
            {submissions.map((submission) => {
              const percent = submission.totalTestCases ? Math.round((submission.passedTestCases / submission.totalTestCases) * 100) : 0;
              return (
                <div
                  key={submission._id}
                  className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/problems/${submission.problemId}`}
                          className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition"
                        >
                          {submission.problemTitle || "Unknown Problem"}
                        </Link>
                        <span className="text-sm text-gray-500">
                          {submission.problemDifficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>Language: <strong>{submission.language.toUpperCase()}</strong></span>
                        <span>Score: <strong>{submission.score || 0}/{submission.totalScore || 0}</strong></span>
                        <span>Passed: <strong>{submission.passedTestCases || 0}/{submission.totalTestCases || 0}</strong></span>
                        <span className="flex items-center gap-1">{percent}% <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div></div></span>
                        {submission.totalRuntime && (
                          <span>Runtime: <strong>{submission.totalRuntime}ms</strong></span>
                        )}
                        {submission.maxMemory && (
                          <span>Memory: <strong>{submission.maxMemory.toFixed(1)}MB</strong></span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(submission.submissionTime).toLocaleString()}
                      </div>
                      {isAdmin && submission.userId && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-700">
                          <User className="w-4 h-4" />
                          <span>{submission.userId.name || submission.userId.username}</span>
                          <span className="text-gray-400">|</span>
                          <span>{submission.userId.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getVerdictColor(submission.verdict)}`}>
                        {getVerdictLabel(submission.verdict)}
                      </span>
                      <Link
                        to={`/submissions/${submission._id}`}
                        className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (page === 1 || page === totalPages || (page >= filters.page - 2 && page <= filters.page + 2)) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded-md ${
                        page === filters.page
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === filters.page - 3 || page === filters.page + 3) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Submissions; 