"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(array, chunkSize) {
  return Array(Math.ceil(array.length / chunkSize)).fill().map(function (_, index) {
    return index * chunkSize;
  }).map(function (begin) {
    return array.slice(begin, begin + chunkSize);
  });
};

exports["default"] = _default;
module.exports = exports.default;