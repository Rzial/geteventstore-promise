"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _connectionManager = _interopRequireDefault(require("./connectionManager"));

var _assert = _interopRequireDefault(require("assert"));

var baseErr = 'Delete stream - ';

var _default = function _default(config) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(streamName, hardDelete) {
      var connection;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (0, _assert["default"])(streamName, "".concat(baseErr, "Stream Name not provided"));
              hardDelete = hardDelete === undefined ? false : hardDelete;
              _context.next = 4;
              return _connectionManager["default"].create(config);

            case 4:
              connection = _context.sent;
              _context.prev = 5;
              _context.next = 8;
              return connection.deleteStream(streamName, -2, hardDelete, config.credentials);

            case 8:
              return _context.abrupt("return", _context.sent);

            case 9:
              _context.prev = 9;
              connection.releaseConnection();
              return _context.finish(9);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5,, 9, 12]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports["default"] = _default;
module.exports = exports.default;