import React from "react";
import { NavLink} from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-300 py-6  text-center text-sm text-slate-600">
      
      <p className="text-base">
        © {new Date().getFullYear()} OnlineJudge. All rights reserved. Built for
        coders, by coders.
      </p>
    </footer>
  );
};

export default Footer;
