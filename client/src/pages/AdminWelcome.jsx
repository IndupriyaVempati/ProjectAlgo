import React from "react";
const AdminWelcome = () => {
  const name = localStorage.getItem("name") || "Admin";
  return (
    <div className="text-center py-20 text-indigo-700 text-2xl font-bold">
      Welcome back, {name}! 👋<br />
      Use the navbar to manage problems and users.
    </div>
  );
};

export default AdminWelcome;
