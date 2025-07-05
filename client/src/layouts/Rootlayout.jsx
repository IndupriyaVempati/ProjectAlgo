import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  const { pathname } = useLocation();
  
  
  return (
    <div className="pt-16 bg-slate-50 min-h-screen text-slate-900 flex flex-col">
       <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
