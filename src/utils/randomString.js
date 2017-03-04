/**
 * Generate random string [a-z].
 *
 * @param {Number} length of desired result
 * @returns {String} result
 */

var randomString = (length) => {
  var result = ''

  while (result.length < length) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
  }

  return result
}

export default randomString
