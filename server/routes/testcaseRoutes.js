const express = require("express");
const {
  addTestcase,
  getTestcasesByProblem,
  getAllTestcasesByProblem,
  updateTestcase,
  deleteTestcase,
  getTestcaseById,
} = require("../controllers/testcaseController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/problem/:pid", getTestcasesByProblem); // Get sample testcases for users

// Admin routes (should be protected with auth middleware)
router.post("/", verifyToken, isAdmin, addTestcase); // Add new testcase
router.get("/admin/problem/:pid", verifyToken, isAdmin, getAllTestcasesByProblem); // Get all testcases for admin
router.get("/:id", verifyToken, isAdmin, getTestcaseById); // Get specific testcase
router.put("/:id", verifyToken, isAdmin, updateTestcase); // Update testcase
router.delete("/:id", verifyToken, isAdmin, deleteTestcase); // Delete testcase

module.exports = router;
