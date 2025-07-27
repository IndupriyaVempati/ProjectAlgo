const mongoose = require("mongoose");

// Schema for individual test case results
const testCaseResultSchema = new mongoose.Schema({
  testcaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Testcase",
    required: true,
  },
  status: {
    type: String,
    enum: ["AC", "WA", "TLE", "MLE", "RE", "CE", "PE"],
    required: true,
  },
  runtime: { type: Number }, // in milliseconds
  memory: { type: Number }, // in MB
  output: { type: String }, // actual output (only for failed cases)
  expectedOutput: { type: String }, // expected output (only for failed cases)
  errorMessage: { type: String }, // compilation or runtime error
});

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: {
      type: String,
      enum: ["Pending", "AC", "WA", "TLE", "MLE", "RE", "CE", "PE"],
      default: "Pending",
    },
    submissionTime: { type: Date, default: Date.now },
    totalRuntime: { type: Number }, // Total runtime in milliseconds
    maxMemory: { type: Number }, // Maximum memory used in MB
    score: { type: Number, default: 0 }, // Score based on passed test cases
    totalScore: { type: Number }, // Total possible score
    testCaseResults: [testCaseResultSchema], // Results for each test case
    compilationError: { type: String }, // Compilation error message if any
    passedTestCases: { type: Number, default: 0 }, // Number of passed test cases
    totalTestCases: { type: Number, default: 0 }, // Total number of test cases
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
