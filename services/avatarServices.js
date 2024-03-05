const path = require("path");

const generateUniqueFileName = (originalFileName) => {
  const timestamp = Date.now();
  const extension = path.extname(originalFileName);
  const fileNameWithoutExtension = originalFileName.replace(/\.[^.]+$/, "");
  return `${fileNameWithoutExtension}_${timestamp}${extension}`;
};

module.exports = { generateUniqueFileName };
