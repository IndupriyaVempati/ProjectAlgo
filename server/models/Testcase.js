const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }, // Hidden testcases for evaluation
    isSample: { type: Boolean, default: false }, // Sample testcases shown to users
    points: { type: Number, default: 1 }, // Points for this testcase
    description: { type: String }, // Optional description for the testcase
    timeLimit: { type: Number, default: 1000 }, // Time limit in milliseconds
    memoryLimit: { type: Number, default: 256 }, // Memory limit in MB
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testcase", testcaseSchema);
