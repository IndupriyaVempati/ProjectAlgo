
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");
if (!fs.existsSync(dirCodes)) fs.mkdirSync(dirCodes, { recursive: true });

const getExtension = (language) => {
  if (language === "python") return "py";
  if (language === "cpp") return "cpp";
  if (language === "c") return "c";
  if (language === "java") return "java";
  return "txt";
};

const generateFile = async (language, code) => {
  const jobId = uuid();
  let filename;
  let filepath;
  if (language === "java") {
    // Save Java code as Main.java in a unique subfolder
    const javaDir = path.join(dirCodes, jobId);
    if (!fs.existsSync(javaDir)) fs.mkdirSync(javaDir, { recursive: true });
    filename = "Main.java";
    filepath = path.join(javaDir, filename);
  } else {
    filename = `${jobId}.${getExtension(language)}`;
    filepath = path.join(dirCodes, filename);
  }
  await fs.promises.writeFile(filepath, code);
  return filepath;
};

module.exports = { generateFile };