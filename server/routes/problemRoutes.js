const express = require("express");
const {
  getAllProblems,
  getProblemById,
  addProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.post("/", verifyToken, isAdmin, addProblem);
router.put("/:id", verifyToken, isAdmin, updateProblem);
router.delete("/:id", verifyToken, isAdmin, deleteProblem);

module.exports = router;
