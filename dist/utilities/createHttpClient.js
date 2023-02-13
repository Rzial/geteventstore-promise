"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _https = _interopRequireDefault(require("https"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var _default = function _default(config) {
  console.log("Created single axios client | httpAgent: ".concat(!!config.httpAgent, " | httpsAgent: ").concat(!!config.httpsAgent));
  return _axios["default"].create(_objectSpread(_objectSpread({
    headers: {
      Accept: 'application/json'
    }
  }, config.httpAgent ? {
    httpAgent: config.httpAgent
  } : {}), config.httpsAgent ? {
    httpsAgent: config.httpsAgent
  } : {
    httpsAgent: !config.validateServer && new _https["default"].Agent({
      rejectUnauthorized: false
    })
  }));
};

exports["default"] = _default;
module.exports = exports.default;