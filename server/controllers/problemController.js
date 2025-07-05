const Problem = require("../models/Problem");

exports.getAllProblems = async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};

exports.getProblemById = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ msg: "Not found" });
  res.json(problem);
};

exports.addProblem = async (req, res) => {
  const problem = await Problem.create(req.body);
  res.status(201).json(problem);
};

exports.updateProblem = async (req, res) => {
  const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(problem);
};

exports.deleteProblem = async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ msg: "Problem deleted" });
};
