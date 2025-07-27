const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require('util');
const execPromise = util.promisify(exec);

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  
  try {
    // Step 1: Compile the C++ code
    const compileCmd = `g++ -std=c++17 -O2 -Wall -o "${outPath}" "${filepath}"`;
    await execPromise(compileCmd);
    
    // Step 2: Read the input file
    const input = fs.readFileSync(inputPath, 'utf-8');
    
    // Step 3: Execute the compiled binary with input
    const { stdout, stderr } = await execPromise(
      `"${outPath}"`,
      { 
        input: input,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 10000, // 10 seconds timeout
        killSignal: 'SIGKILL'
      }
    );
    
    // Clean up the compiled binary
    try {
      if (fs.existsSync(outPath)) {
        fs.unlinkSync(outPath);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up compiled binary:', cleanupError);
    }
    
    if (stderr && stderr.trim()) {
      // Filter out common warnings that aren't actual errors
      const filteredStderr = stderr
        .split('\n')
        .filter(line => !line.includes('warning:'))
        .join('\n');
        
      if (filteredStderr.trim()) {
        throw new Error(filteredStderr);
      }
    }
    
    return stdout;
  } catch (error) {
    // Clean up the compiled binary if it exists
    try {
      if (fs.existsSync(outPath)) {
        fs.unlinkSync(outPath);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up compiled binary:', cleanupError);
    }
    
    // Format the error message
    let errorMsg = error.stderr || error.message || 'Unknown error occurred';
    
    // Clean up common C++ error messages
    errorMsg = errorMsg
      .replace(/\s+\^\s*\n/g, '\n')  // Remove caret indicators
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .replace(/\s+$/, '')  // Remove trailing whitespace
      .trim();
      
    if (errorMsg.includes('error:') || errorMsg.includes('compilation terminated')) {
      throw new Error(`Compilation Error: ${errorMsg}`);
    }
    
    throw new Error(errorMsg || 'Unknown error occurred during execution');
  }
};

module.exports = { executeCpp };