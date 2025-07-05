const express = require("express");
const {
  addTestcase,
  getTestcasesByProblem,
} = require("../controllers/testcaseController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, isAdmin, addTestcase);
router.get("/:pid", verifyToken, getTestcasesByProblem);

module.exports = router;
