const replacements = require('./config/char_replacements.js')

// consumes (val)
// removes chars specified in config/char_replacements
const removeCharacters = function(val) {
  if (typeof val === 'string') {
    let result = val;
    for (let [x, y] of replacements)
      result = result.replace(x, y);
    return result;
  }
  return val;
}

module.exports = {
  removeCharacters
}
