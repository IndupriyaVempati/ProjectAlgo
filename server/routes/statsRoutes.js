const express = require("express");
const { getTopUsers, getTopProblems, getVerdictStats, getLanguageStats } = require("../controllers/statsController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/top-users", verifyToken, isAdmin, getTopUsers);
router.get("/top-problems", verifyToken, isAdmin, getTopProblems);
router.get("/verdicts", verifyToken, isAdmin, getVerdictStats);
router.get("/languages", verifyToken, isAdmin, getLanguageStats);

module.exports = router; 