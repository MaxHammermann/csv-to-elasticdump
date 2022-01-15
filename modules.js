const replacements = require('./config/char_replacements.js')

// consume (key, val) returns val without given chars
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
