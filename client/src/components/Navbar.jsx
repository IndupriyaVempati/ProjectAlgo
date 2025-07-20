import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  setIsLoggedIn(!!token);
  setRole(storedRole);
}, [location.pathname, localStorage.getItem("role")]); // add role check


  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600"
    }`;

  const renderLinks = () => {
    if (!isLoggedIn) {
      return (
        <>
          <NavLink to="/login" className={linkClass}>Login</NavLink>
          <NavLink to="/register" className={linkClass}>Register</NavLink>
        </>
      );
    }

    if (role === "admin") {
      return (
        <>
          <NavLink to="/api/problems" className={linkClass}>Problems</NavLink>
                <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
                <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <button onClick={handleLogout} className="text-red-500 hover:underline text-sm font-medium">
            Logout 
          </button>
        </>
      );
    }

    // default user
    return (
      <>
        <NavLink to="/problems" className={linkClass}>Problems</NavLink>
        <NavLink to="/submissions" className={linkClass}>Submissions</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        <button onClick={handleLogout} className="text-red-500 hover:underline text-sm font-medium">
          Logout
        </button>
      </>
    );
  };

  return (
    <nav className="bg-slate-100 border-b border-slate-200 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-extrabold text-indigo-700 tracking-wide">
          OnlineJudge
        </NavLink>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-indigo-600">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-5 items-center">
          {renderLinks()}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-100 px-6 py-6 flex flex-col space-y-4 border-t border-slate-300">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
