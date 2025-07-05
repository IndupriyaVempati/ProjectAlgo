const express = require("express");
const {
  submitCode,
  getUserSubmissions,
  getSubmissionById,
} = require("../controllers/submissionController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", verifyToken, submitCode);
router.get("/user/:uid", verifyToken, getUserSubmissions);
router.get("/:id", verifyToken, getSubmissionById);

module.exports = router;
