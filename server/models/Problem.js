const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyTags: [String],
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    topics: [String],
    description: { type: String, required: true },
    constraints: String,
    hints: [String],
    sampleInputs: [String],
    sampleOutputs: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
