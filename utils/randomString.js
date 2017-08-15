'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = randomString;
function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

  var result = '';

  while (result.length < length) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  return result;
}