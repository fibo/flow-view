/**
 * Generate random string [a-z].
 *
 * @flow
 * @param {Number} length of desired result
 * @returns {String} result
 */

export default function randomString (length: number = 3): string {
  let result = ''

  while (result.length < length) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
  }

  return result
}
