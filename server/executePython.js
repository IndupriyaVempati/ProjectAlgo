const { exec } = require("child_process");
const path = require("path");

const executePython = (filepath, inputPath) => {
  const isWin = process.platform === "win32";
  const pythonCmd = isWin ? "python" : "python3";
  return new Promise((resolve, reject) => {
    exec(
      `${pythonCmd} "${filepath}" < "${inputPath}"`,
      (error, stdout, stderr) => {
        if (error) return reject({ error, stderr });
        if (stderr) return reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = { executePython }; 