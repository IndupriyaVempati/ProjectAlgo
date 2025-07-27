import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminTestcases = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [testcases, setTestcases] = useState([]);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestcase, setEditingTestcase] = useState(null);
  const [formData, setFormData] = useState({
    input: "",
    output: "",
    isHidden: false,
    isSample: false,
    points: 1,
    description: "",
    timeLimit: 1000,
    memoryLimit: 256
  });

  useEffect(() => {
    fetchProblem();
    fetchTestcases();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_URL}/api/problems/${problemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProblem(res.data);
    } catch (err) {
      setError("Failed to fetch problem details");
    }
  };

  const fetchTestcases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_URL}/api/testcases/admin/problem/${problemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setTestcases(res.data.testcases);
      }
    } catch (err) {
      setError("Failed to fetch testcases");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        problemId
      };

      if (editingTestcase) {
        // Update existing testcase
        await axios.put(
          `${import.meta.env.VITE_REACT_URL}/api/testcases/${editingTestcase._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new testcase
        await axios.post(
          `${import.meta.env.VITE_REACT_URL}/api/testcases`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Reset form and refresh testcases
      setFormData({
        input: "",
        output: "",
        isHidden: false,
        isSample: false,
        points: 1,
        description: "",
        timeLimit: 1000,
        memoryLimit: 256
      });
      setShowAddForm(false);
      setEditingTestcase(null);
      fetchTestcases();
    } catch (err) {
      setError("Failed to save testcase");
    }
  };

  const handleEdit = (testcase) => {
    setFormData({
      input: testcase.input,
      output: testcase.output,
      isHidden: testcase.isHidden,
      isSample: testcase.isSample,
      points: testcase.points,
      description: testcase.description || "",
      timeLimit: testcase.timeLimit,
      memoryLimit: testcase.memoryLimit
    });
    setEditingTestcase(testcase);
    setShowAddForm(true);
  };

  const handleDelete = async (testcaseId) => {
    if (!confirm("Are you sure you want to delete this testcase?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_REACT_URL}/api/testcases/${testcaseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTestcases();
    } catch (err) {
      setError("Failed to delete testcase");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTestcase(null);
    setFormData({
      input: "",
      output: "",
      isHidden: false,
      isSample: false,
      points: 1,
      description: "",
      timeLimit: 1000,
      memoryLimit: 256
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-2 px-3 py-1 text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Back to Problem
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Testcases
          </h1>
          {problem && (
            <p className="text-gray-600 mt-1">{problem.title}</p>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Add Testcase
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTestcase ? "Edit Testcase" : "Add New Testcase"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input
                </label>
                <textarea
                  value={formData.input}
                  onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Output
                </label>
                <textarea
                  value={formData.output}
                  onChange={(e) => setFormData({ ...formData, output: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (ms)
                </label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                  min="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memory Limit (MB)
                </label>
                <input
                  type="number"
                  value={formData.memoryLimit}
                  onChange={(e) => setFormData({ ...formData, memoryLimit: parseInt(e.target.value) })}
                  min="64"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description of this testcase"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isHidden}
                  onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                  className="mr-2"
                />
                Hidden Testcase (for evaluation only)
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isSample}
                  onChange={(e) => setFormData({ ...formData, isSample: e.target.checked })}
                  className="mr-2"
                />
                Sample Testcase (visible to users)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                {editingTestcase ? "Update Testcase" : "Add Testcase"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testcases List */}
      <div className="space-y-4">
        {testcases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No testcases found. Add some testcases to get started.
          </div>
        ) : (
          testcases.map((testcase, index) => (
            <div key={testcase._id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Testcase #{index + 1}</h3>
                  <div className="flex gap-2">
                    {testcase.isSample && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                        Sample
                      </span>
                    )}
                    {testcase.isHidden && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                        Hidden
                      </span>
                    )}
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                      {testcase.points} pts
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testcase)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testcase._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {testcase.description && (
                <p className="text-gray-600 mb-3">{testcase.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input
                  </label>
                  <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                    {testcase.input}
                  </pre>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Output
                  </label>
                  <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                    {testcase.output}
                  </pre>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                <span>Time Limit: <strong>{testcase.timeLimit}ms</strong></span>
                <span>Memory Limit: <strong>{testcase.memoryLimit}MB</strong></span>
                <span>Created: <strong>{new Date(testcase.createdAt).toLocaleDateString()}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestcases;
