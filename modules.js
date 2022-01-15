const replacements = require('./config/char_replacements.js')
const fs = require("fs");

// consumes (val)
// removes chars specified in config/char_replacements
const removeCharacters = function (val) {
  if (typeof val === 'string') {
    let result = val;
    for (let [x, y] of replacements)
      result = result.replace(x, y);
    return result;
  }
  return val;
}

// Updates the same console line with every input
const updateProgress = function (count) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write("Processed: " + count);
}

// Deletes the existing file if it exists and outputs a message if a file has been deleted.
const deleteExisting = async function (file) {
  // Check if the file exists in the current directory.
  fs.access(file, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(file, () => {
        console.log(`\n Existing file at ${file} has been replaced.`)
      })
    }
  });
}

module.exports = {
  removeCharacters,
  updateProgress,
  deleteExisting
}
