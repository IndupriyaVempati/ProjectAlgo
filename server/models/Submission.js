const mongoose = require("mongoose");

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
    verdict: { type: String, default: "Pending" },
    submissionTime: { type: Date, default: Date.now },
    runtime: String,
    memory: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
