const fs = require("fs");
const storageFile = "localStorage.json";

exports.readStorage = () => {
  if (!fs.existsSync(storageFile)) {
    return {};
  }
  const data = fs.readFileSync(storageFile);
  return JSON.parse(data);
};
exports.writeStorage = (data) => {
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
};
