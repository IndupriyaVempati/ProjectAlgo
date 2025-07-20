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


function App() {
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
      <Route index element={<Home />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="user-welcome" element={<UserWelcome />} />
      <Route path="admin-welcome" element={<AdminWelcome />} />
      <Route path="api/problems" element={<AdminProblems />} />
      <Route path="admin/users" element={<AdminUsers />} />
      <Route path="profile" element={<Profile />} />
      {/* Add more routes as needed */}
      </Route>
    </Routes>
  );
}

export default App;
