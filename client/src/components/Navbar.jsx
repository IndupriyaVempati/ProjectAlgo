import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const LinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600"
    }`;

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

        <div className="hidden md:flex gap-5 items-center">
          {isLoggedIn ? (
            <>
              <NavLink to="/problems" className={LinkClass}>Problems</NavLink>
              <NavLink to="/submissions" className={LinkClass}>Submissions</NavLink>
              <NavLink to="/profile" className={LinkClass}>Profile</NavLink>
              {role === "admin" && <NavLink to="/admin" className={LinkClass}>Admin</NavLink>}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={LinkClass}>Login</NavLink>
              <NavLink to="/register" className={LinkClass}>Register</NavLink>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-100 px-6 py-6 flex flex-col space-y-4 border-t border-slate-300">
          {isLoggedIn ? (
            <>
              <NavLink to="/problems" onClick={toggleMenu} className={LinkClass}>Problems</NavLink>
              <NavLink to="/submissions" onClick={toggleMenu} className={LinkClass}>Submissions</NavLink>
              <NavLink to="/profile" onClick={toggleMenu} className={LinkClass}>Profile</NavLink>
              {role === "admin" && (
                <NavLink to="/admin" onClick={toggleMenu} className={LinkClass}>Admin</NavLink>
              )}
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="text-red-500 hover:underline text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={toggleMenu} className={LinkClass}>Login</NavLink>
              <NavLink to="/register" onClick={toggleMenu} className={LinkClass}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
