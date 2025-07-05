import React from 'react'
import './App.css'
import './index.css'
import { Routes, Route } from "react-router-dom";
import Rootlayout from "./layouts/Rootlayout";

// Pages
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Problems from "./pages/Problems";
// import ProblemDetail from "./pages/ProblemDetail";
// import Profile from "./pages/Profile";
// import Submissions from "./pages/Submissions";
// import AdminPanel from "./pages/AdminPanel";

// Auth-protected Routes
// import ProtectedRoute from "./routes/ProtectedRoute";
// import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
      <Route index element={<Home />} />
        {/* <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        /> */}
      </Route>
    </Routes>
  );
}

export default App;
