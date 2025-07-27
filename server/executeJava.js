const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeJava = async (filepath, inputPath) => {
  const dir = path.dirname(filepath);
  const className = 'Main';
  
  try {
    // Step 1: Compile the Java file with proper classpath
    const compileCommand = `javac -cp "${dir}" "${filepath}"`;
    await execPromise(compileCommand);
    
    // Step 2: Read the input file content
    const input = fs.readFileSync(inputPath, 'utf-8').trim();
    
    // Step 3: Execute the Java program with proper classpath
    const executeCommand = `java -cp "${dir}" ${className}`;
    const { stdout, stderr } = await execPromise(
      executeCommand,
      { 
        input: input,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 10000, // 10 seconds timeout
        killSignal: 'SIGKILL',
        cwd: dir // Set working directory to where the class files are
      }
    );

    if (stderr) {
      // Filter out common JVM warnings that aren't actual errors
      const filteredStderr = stderr
        .split('\n')
        .filter(line => !line.includes('Picked up JAVA_TOOL_OPTIONS:'))
        .filter(line => !line.includes('WARNING:'))
        .filter(line => !line.includes('warning:'))
        .join('\n');
        
      if (filteredStderr.trim()) {
        // Only throw if there's actual error content after filtering
        throw new Error(filteredStderr);
      }
    }

    return stdout.trim();
  } catch (error) {
    // Format the error message to be more user-friendly
    let errorMsg = error.stderr || error.message || 'Unknown error occurred';
    
    // Clean up common Java error messages
    errorMsg = errorMsg
      .replace(/Picked up JAVA_TOOL_OPTIONS:.*\n?/g, '')
      .replace(/Note: .*\n?/g, '')
      .replace(/\s+\^\s*\n/g, '\n')  // Remove caret indicators
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .replace(/\bat .*\(.*\.java:\d+\)/g, '')  // Remove stack traces
      .replace(/\s+$/, '')  // Remove trailing whitespace
      .trim();
      
    // If we have a compilation error, make sure it's properly formatted
    if (errorMsg.includes('compilation failed') || errorMsg.includes('error:')) {
      throw new Error(`Compilation Error: ${errorMsg}`);
    }
    
    throw new Error(errorMsg || 'Unknown error occurred during execution');
  }
};

module.exports = { executeJava };