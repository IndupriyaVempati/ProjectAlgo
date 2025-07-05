import React from "react";
import { NavLink } from "react-router-dom";
import { BrainCircuit, Rocket, Code2, TerminalSquare, Trophy, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <section className="min-h-screen w-full bg-gradient-to-tr from-[#edf2ff] to-[#f8fafc] text-slate-900 flex flex-col items-center px-6 py-20 relative overflow-hidden">
      {/* Floating gradient */}
      <div className="absolute top-[-100px] left-[50%] transform -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100 blur-[160px] z-0 rounded-full opacity-30" />

      {/* Hero Section */}
      <div className="text-center max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-indigo-700 mb-4 leading-tight">
          Elevate Your Coding Journey
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8">
          Solve real-world problems. Compete. Improve. Whether you're a beginner or a pro, OnlineJudge is built for you.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <NavLink
            to="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xl transition-all duration-200"
          >
            Start Coding
          </NavLink>
          <NavLink
            to="/register"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold shadow-md transition-all duration-200"
          >
            Join the Mission
          </NavLink>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4 relative z-10">
        <FeatureCard
          icon={<BrainCircuit size={36} className="text-indigo-500" />}
          title="Master Logic"
          description="Sharpen your thinking with curated problems across companies and topics."
        />
        <FeatureCard
          icon={<Rocket size={36} className="text-emerald-500" />}
          title="Real Submissions"
          description="Submit code, get verdicts instantly, track efficiency, and learn from failure."
        />
        <FeatureCard
          icon={<TerminalSquare size={36} className="text-pink-500" />}
          title="Developer First"
          description="Minimal UI, blazing fast, distraction-free. Just you and the problem."
        />
        <FeatureCard
          icon={<Sparkles size={36} className="text-yellow-500" />}
          title="Interview Prep"
          description="Ace coding rounds with questions modeled after top tech companies."
        />
        <FeatureCard
          icon={<Trophy size={36} className="text-orange-500" />}
          title="Climb the Leaderboard"
          description="Solve problems and compete with others to level up your rank."
        />
        <FeatureCard
          icon={<Code2 size={36} className="text-cyan-500" />}
          title="Built by Coders"
          description="Built by devs who know what you need — fast, scalable, intuitive."
        />
      </div>

      
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

export default Home;
