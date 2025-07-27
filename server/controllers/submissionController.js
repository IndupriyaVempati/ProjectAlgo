const Submission = require("../models/Submission");
const Testcase = require("../models/Testcase");
const mongoose = require("mongoose");
const { generateFile } = require("../generateFile");
const { generateInputFile } = require("../generateInputFile");
const { executeCpp } = require("../executeCpp");
const { executeC } = require("../executeC");
const { executePython } = require("../executePython");
const { executeJava } = require("../executeJava");
const fs = require("fs").promises;

// Submit code and evaluate against all testcases
exports.submitCode = async (req, res) => {
  try {
    const { userId, problemId, code, language } = req.body;

    if (!code || code.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Empty code! Please provide some code to submit.",
      });
    }

    // Convert IDs to ObjectId if they're valid ObjectId strings
    let userObjectId = userId;
    let problemObjectId = problemId;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      userObjectId = new mongoose.Types.ObjectId(userId);
    }
    if (mongoose.Types.ObjectId.isValid(problemId)) {
      problemObjectId = new mongoose.Types.ObjectId(problemId);
    }

    // Create initial submission
    const submission = await Submission.create({
      userId: userObjectId,
      problemId: problemObjectId,
      code,
      language,
      verdict: "Pending",
    });

    // Get all testcases for the problem
    const testcases = await Testcase.find({ problemId: problemObjectId }).sort({
      createdAt: 1,
    });

    if (testcases.length === 0) {
      await Submission.findByIdAndUpdate(submission._id, {
        verdict: "CE",
        compilationError: "No testcases found for this problem",
      });
      return res
        .status(400)
        .json({ success: false, error: "No testcases found for this problem" });
    }

    // Evaluate code against all testcases
    const results = await evaluateSubmission(code, language, testcases);

    // Calculate final verdict and score
    let {
      verdict,
      score,
      totalScore,
      passedTestCases,
      testCaseResults,
      maxMemory,
      totalRuntime,
    } = results;
    
    // Ensure consistent verdict values - keep as AC since that's what schema expects
    // No need to convert AC to Accepted

    // Update submission with results
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submission._id,
      {
        verdict,
        score,
        totalScore,
        passedTestCases,
        totalTestCases: testcases.length,
        testCaseResults,
        maxMemory,
        totalRuntime,
        compilationError: results.compilationError,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Code submitted and evaluated",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Evaluate submission against testcases
async function evaluateSubmission(code, language, testcases) {
  let passedTestCases = 0;
  let totalScore = 0;
  let score = 0;
  let verdict = "AC"; // Use AC for consistency with schema
  let testCaseResults = [];
  let maxMemory = 0;
  let totalRuntime = 0;
  let compilationError = null;

  try {
    // Generate code file
    const filePath = await generateFile(language, code);

    for (const testcase of testcases) {
      totalScore += testcase.points || 1;

      try {
        // Generate input file for this testcase
        const inputPath = await generateInputFile(testcase.input);

        let output;
        let runtime = 0;
        let memory = 0;

        const startTime = Date.now();

        // Execute code based on language
        if (language === "cpp") {
          output = await executeCpp(filePath, inputPath);
        } else if (language === "c") {
          output = await executeC(filePath, inputPath);
        } else if (language === "python") {
          output = await executePython(filePath, inputPath);
        } else if (language === "java") {
          output = await executeJava(filePath, inputPath);
        } else {
          throw new Error("Unsupported language");
        }

        runtime = Date.now() - startTime;
        totalRuntime += runtime;

        // Compare output with expected output
        const actualOutput = output.trim();
        const expectedOutput = testcase.output.trim();

        let status;
        if (actualOutput === expectedOutput) {
          status = "AC"; // Use AC for consistency
          passedTestCases++;
          score += testcase.points || 1;
        } else {
          status = "WA"; // Use WA for consistency
          if (verdict === "AC") verdict = "WA";
        }

        // Estimate memory usage (simplified)
        memory = Math.random() * 50 + 10; // Random between 10-60 MB for demo
        maxMemory = Math.max(maxMemory, memory);

        testCaseResults.push({
          testcaseId: testcase._id,
          status,
          runtime,
          memory,
          output: status !== "AC" ? actualOutput : undefined,
          expectedOutput: status !== "AC" ? expectedOutput : undefined,
        });

        // Check time limit
        if (runtime > (testcase.timeLimit || 1000)) {
          testCaseResults[testCaseResults.length - 1].status = "TLE";
          if (verdict === "AC") verdict = "TLE";
        }

        // Check memory limit
        if (memory > (testcase.memoryLimit || 256)) {
          testCaseResults[testCaseResults.length - 1].status = "MLE";
          if (verdict === "AC") verdict = "MLE";
        }
      } catch (error) {
        let status = "RE";
        if (
          error.message.includes("compilation") ||
          error.message.includes("compile")
        ) {
          status = "CE";
          compilationError = error.message;
        }

        testCaseResults.push({
          testcaseId: testcase._id,
          status,
          errorMessage: error.message,
        });

        if (verdict === "AC") verdict = status;
      }
    }
  } catch (error) {
    verdict = "CE";
    compilationError = error.message;
  }

  return {
    verdict,
    score,
    totalScore,
    passedTestCases,
    testCaseResults,
    maxMemory,
    totalRuntime,
    compilationError,
  };
}

// Get submission by ID with detailed results
exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id)
      .populate("userId", "username email role")
      .populate("problemId", "title description difficulty")
      .populate(
        "testCaseResults.testcaseId",
        "input output isHidden isSample description"
      );

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, error: "Submission not found" });
    }

    // Determine if the user is admin
    let isAdmin = false;
    if (req.user && req.user.role === "admin") {
      isAdmin = true;
    }

    // Filter testCaseResults for non-admins: only show non-hidden or sample test cases
    let filteredTestCaseResults = submission.testCaseResults;
    let hasHidden = false;
    if (!isAdmin) {
      filteredTestCaseResults = submission.testCaseResults.filter((tc) => {
        if (tc.testcaseId && tc.testcaseId.isHidden) {
          hasHidden = true;
          return false;
        }
        return true;
      });
    }

    // Return filtered results and a flag if hidden test cases exist
    const responseSubmission = submission.toObject();
    responseSubmission.testCaseResults = filteredTestCaseResults;
    responseSubmission.hasHiddenTestcases = hasHidden;

    res.json({ success: true, submission: responseSubmission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all submissions (Admin only)
exports.getAllSubmissions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      userId,
      problemId,
      verdict,
      language,
    } = req.query;

    let filter = {};
    if (userId) filter.userId = userId;
    if (problemId) filter.problemId = problemId;
    if (verdict) filter.verdict = verdict;
    if (language) filter.language = language;

    const submissions = await Submission.find(filter)
      .populate("userId", "username email name role")
      .populate("problemId", "title difficulty")
      .sort({ submissionTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(filter);

    res.json({
      success: true,
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user submissions
exports.getUserSubmissions = async (req, res) => {
  try {
    const { uid: userId } = req.params;
    const { page = 1, limit = 10, problemId, verdict, language } = req.query;

    // Convert to numbers and validate
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    const query = { userId };
    if (problemId) query.problemId = problemId;
    if (verdict) query.verdict = verdict;
    if (language) query.language = language;

    // Get total count for pagination
    const total = await Submission.countDocuments(query);

    // Get paginated submissions with problem details
    const submissions = await Submission.find(query)
      .sort({ submissionTime: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('problemId', 'title difficulty')
      .lean();

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNumber);

    // Transform the response
    const result = {
      data: submissions.map(sub => ({
        ...sub,
        problemTitle: sub.problemId?.title || 'Problem not found',
        problemDifficulty: sub.problemId?.difficulty || 'Unknown',
        problemId: sub.problemId?._id || null
      })),
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get user's solved problems
exports.getUserSolvedProblems = async (req, res) => {
  try {
    const { uid: userId } = req.params;
    
    // Find all accepted submissions and group by problem
    const solvedProblems = await Submission.aggregate([
      { $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        verdict: 'AC'
      }},
      { $group: {
        _id: '$problemId',
        lastSolved: { $max: '$submissionTime' },
        submissionId: { $first: '$_id' }
      }},
      { $lookup: {
        from: 'problems',
        localField: '_id',
        foreignField: '_id',
        as: 'problem'
      }},
      { $unwind: '$problem' },
      { $project: {
        _id: 0,
        problemId: '$_id',
        submissionId: 1,
        title: '$problem.title',
        difficulty: '$problem.difficulty',
        tags: '$problem.tags',
        solvedAt: '$lastSolved'
      }},
      { $sort: { solvedAt: -1 }}
    ]);

    res.json({
      success: true,
      count: solvedProblems.length,
      data: solvedProblems
    });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch solved problems',
      details: error.message 
    });
  }
};

// Get submission statistics
exports.getSubmissionStats = async (req, res) => {
  try {
    const { userId, problemId } = req.query;

    let matchFilter = {};
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        matchFilter.userId = new mongoose.Types.ObjectId(userId);
      } else {
        matchFilter.userId = userId;
      }
    }
    if (problemId) {
      if (mongoose.Types.ObjectId.isValid(problemId)) {
        matchFilter.problemId = new mongoose.Types.ObjectId(problemId);
      } else {
        matchFilter.problemId = problemId;
      }
    }

    const stats = await Submission.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$verdict",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Submission.countDocuments(matchFilter);

    res.json({ success: true, stats, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


