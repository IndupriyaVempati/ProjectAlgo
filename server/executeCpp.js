const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const execCmd = `g++ "${filepath}" -o "${outPath}" && "${outPath}" < "${inputPath}"`;
  return new Promise((resolve, reject) => {
    exec(
      execCmd,
      (error, stdout, stderr) => {
        if (error) return reject({ error, stderr });
        if (stderr) return reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = { executeCpp }; 