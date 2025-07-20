const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirInputs = path.join(__dirname, "inputs");
if (!fs.existsSync(dirInputs)) fs.mkdirSync(dirInputs, { recursive: true });

const generateInputFile = async (input) => {
  const jobId = uuid();
  const filename = `${jobId}.txt`;
  const filepath = path.join(dirInputs, filename);
  await fs.promises.writeFile(filepath, input || "");
  return filepath;
};

module.exports = { generateInputFile };
