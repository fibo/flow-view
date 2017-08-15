"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ignoreEvent;
function ignoreEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}