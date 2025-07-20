import React from "react";

const UserWelcome = () => {
  const name = localStorage.getItem("name") || "User";
  return (
    <div className="text-center py-20 text-indigo-700 text-2xl font-bold">
      Welcome, {name}! 🚀<br />
      Start solving DSA problems from the Problems page.
    </div>
  );
};

export default UserWelcome;
