const Submission = require("../models/Submission");
const User = require("../models/User");
const Problem = require("../models/Problem");

// Top performers: users with most AC submissions
exports.getTopUsers = async (req, res) => {
  try {
    const agg = await Submission.aggregate([
      { $match: { verdict: "AC" } },
      { $group: { _id: "$userId", acCount: { $sum: 1 } } },
      { $sort: { acCount: -1 } },
      { $limit: 10 },
    ]);
    const users = await User.find({ _id: { $in: agg.map(u => u._id) } });
    const topUsers = agg.map(u => {
      const user = users.find(us => us._id.equals(u._id));
      return { name: user ? user.name : "Unknown", acCount: u.acCount };
    });
    res.json({ topUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top problems: most solved (AC submissions)
exports.getTopProblems = async (req, res) => {
  try {
    const agg = await Submission.aggregate([
      { $match: { verdict: "AC" } },
      { $group: { _id: "$problemId", solvedCount: { $sum: 1 } } },
      { $sort: { solvedCount: -1 } },
      { $limit: 10 },
    ]);
    const problems = await Problem.find({ _id: { $in: agg.map(p => p._id) } });
    const topProblems = agg.map(p => {
      const prob = problems.find(pr => pr._id.equals(p._id));
      return { title: prob ? prob.title : "Unknown", solvedCount: p.solvedCount };
    });
    res.json({ topProblems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verdict distribution (all submissions)
exports.getVerdictStats = async (req, res) => {
  try {
    const agg = await Submission.aggregate([
      { $group: { _id: "$verdict", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const verdicts = agg.map(v => ({ verdict: v._id, count: v.count }));
    res.json({ verdicts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Language usage (all submissions)
exports.getLanguageStats = async (req, res) => {
  try {
    const agg = await Submission.aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const languages = agg.map(l => ({ language: l._id, count: l.count }));
    res.json({ languages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 