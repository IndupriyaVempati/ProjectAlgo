const Testcase = require("../models/Testcase");

// Add a new testcase (Admin only)
exports.addTestcase = async (req, res) => {
  try {
    const testcase = await Testcase.create(req.body);
    res.status(201).json({ success: true, testcase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get testcases by problem (different views for admin vs user)
exports.getTestcasesByProblem = async (req, res) => {
  try {
    const { pid } = req.params;
    const { showHidden = false } = req.query;
    
    let filter = { problemId: pid };
    
    // If not showing hidden testcases (normal user view), only show sample testcases
    if (!showHidden) {
      filter.isSample = true;
    }
    
    const testcases = await Testcase.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, testcases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all testcases for a problem (Admin only)
exports.getAllTestcasesByProblem = async (req, res) => {
  try {
    const { pid } = req.params;
    const testcases = await Testcase.find({ problemId: pid }).sort({ createdAt: 1 });
    res.json({ success: true, testcases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a testcase (Admin only)
exports.updateTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const testcase = await Testcase.findByIdAndUpdate(id, req.body, { new: true });
    if (!testcase) {
      return res.status(404).json({ success: false, error: "Testcase not found" });
    }
    res.json({ success: true, testcase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a testcase (Admin only)
exports.deleteTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const testcase = await Testcase.findByIdAndDelete(id);
    if (!testcase) {
      return res.status(404).json({ success: false, error: "Testcase not found" });
    }
    res.json({ success: true, message: "Testcase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single testcase by ID (Admin only)
exports.getTestcaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const testcase = await Testcase.findById(id);
    if (!testcase) {
      return res.status(404).json({ success: false, error: "Testcase not found" });
    }
    res.json({ success: true, testcase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
