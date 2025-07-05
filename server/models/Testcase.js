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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testcase", testcaseSchema);
