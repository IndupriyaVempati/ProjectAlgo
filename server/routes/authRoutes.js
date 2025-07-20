const express = require("express");
const {
  register,
  login,
  getUsers,
  getProfile,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/profile", verifyToken, getProfile);
module.exports = router;
