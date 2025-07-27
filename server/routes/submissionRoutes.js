const express = require("express");
const {
  submitCode,
  getUserSubmissions,
  getSubmissionById,
  getAllSubmissions,
  getSubmissionStats,
  getUserSolvedProblems,
} = require("../controllers/submissionController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Specific routes MUST come before parameterized routes
router.get("/stats", verifyToken, getSubmissionStats); // Get submission statistics
router.get("/user/:uid/solved", verifyToken, getUserSolvedProblems); // Get user's solved problems (MUST come before /user/:uid)
router.get("/user/:uid", verifyToken, getUserSubmissions); // Get user's submissions
router.post("/", verifyToken, submitCode); // Submit code for evaluation
router.get("/:id", verifyToken, getSubmissionById); // Get specific submission

// Admin routes
router.get("/admin/all", verifyToken, isAdmin, getAllSubmissions); // Get all submissions (admin only)

module.exports = router;
