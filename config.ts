const path = require("path");

function getProjectRoot() {
  return path.resolve(process.cwd());
}

module.exports = { getProjectRoot };
