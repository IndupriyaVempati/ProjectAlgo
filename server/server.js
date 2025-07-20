const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const testcaseRoutes = require("./routes/testcaseRoutes");

const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executeC } = require('./executeC');
const { executePython } = require('./executePython');
const { executeJava } = require('./executeJava');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testcaseRoutes);

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input = '' } = req.body;
    if (!code || code.trim() === '') {
        return res.status(400).json({ success: false, error: "Empty code! Please provide some code to execute." });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        let output;
        if (language === 'cpp') {
            output = await executeCpp(filePath, inputPath);
        } else if (language === 'c') {
            output = await executeC(filePath, inputPath);
        } else if (language === 'python') {
            output = await executePython(filePath, inputPath);
        } else if (language === 'java') {
            output = await executeJava(filePath, inputPath);
        } else {
            throw new Error('Unsupported language');
        }
        res.json({ success: true, output });
    } catch (error) {
        res.status(500).json({ success: false, error: error.stderr || error.error || error.message || 'Execution error' });
    }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000 and DB connected");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
