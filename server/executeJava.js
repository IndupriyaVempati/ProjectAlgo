const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, { recursive: true });

const executeJava = (filepath, inputPath) => {
  const dir = path.dirname(filepath);
  const execCmd = `javac "${filepath}" && java -cp "${dir}" Main < "${inputPath}"`;
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

module.exports = { executeJava }; 