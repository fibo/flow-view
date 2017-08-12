'use strict';

function randomString(length) {
  var result = '';

  while (result.length < length) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  return result;
}

module.exports = exports.default = randomString;