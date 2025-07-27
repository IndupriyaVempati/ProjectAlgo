import React from 'react'
import './App.css'
import './index.css'
import { Routes, Route } from "react-router-dom";
import Rootlayout from "./layouts/Rootlayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminWelcome from './pages/AdminWelcome';
import AdminProblems from './pages/AdminProblems';
import AdminUsers from './pages/AdminUsers';
import UserWelcome from './pages/UserWelcome';
import UserProblems from './pages/UserProblems';
import Profile from './pages/Profile';
import AddProblem from "./pages/AddProblem";
import EditProblem from "./pages/EditProblem";
import Submissions from "./pages/Submissions";
import ProblemSolve from "./pages/ProblemSolve";
import AdminTestcases from "./pages/AdminTestcases";
import SubmissionDetail from "./pages/SubmissionDetail";
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="user-welcome" element={<UserWelcome />} />
      <Route path="admin-welcome" element={<AdminWelcome />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />
      <Route path="api/problems" element={<AdminProblems />} />
      <Route path="admin/problems/add" element={<AddProblem />} />
      <Route path="admin/problems/edit/:id" element={<EditProblem />} />
      <Route path="admin/users" element={<AdminUsers />} />
      <Route path="profile" element={<Profile />} />
      <Route path="problems" element={<UserProblems />} />
      <Route path="problems/:id" element={<ProblemSolve />} />
      <Route path="submissions" element={<Submissions />} />
      <Route path="submissions/:id" element={<SubmissionDetail />} />
      <Route path="admin/problems/:problemId/testcases" element={<AdminTestcases />} />
      {/* Add more routes as needed */}
      </Route>
    </Routes>
  );
}

export default App;
