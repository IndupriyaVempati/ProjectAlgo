const Submission = require("../models/Submission");

exports.submitCode = async (req, res) => {
  const newSubmission = await Submission.create(req.body);
  res.status(201).json({ msg: "Code submitted", submission: newSubmission });
};

exports.getUserSubmissions = async (req, res) => {
  const submissions = await Submission.find({ userId: req.params.uid });
  res.json(submissions);
};

exports.getSubmissionById = async (req, res) => {
  const submission = await Submission.findById(req.params.id);
  res.json(submission);
};
