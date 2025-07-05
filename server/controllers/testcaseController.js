const Testcase = require("../models/Testcase");

exports.addTestcase = async (req, res) => {
  const testcase = await Testcase.create(req.body);
  res.status(201).json(testcase);
};

exports.getTestcasesByProblem = async (req, res) => {
  const testcases = await Testcase.find({ problemId: req.params.pid });
  res.json(testcases);
};
