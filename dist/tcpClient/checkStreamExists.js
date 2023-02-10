"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _connectionManager = _interopRequireDefault(require("./connectionManager"));

var _nodeEventstoreClient = _interopRequireDefault(require("node-eventstore-client"));

var _assert = _interopRequireDefault(require("assert"));

var baseErr = 'Check stream exits - ';

var _default = function _default(config) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(streamName) {
      var connection, slice;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (0, _assert["default"])(streamName, "".concat(baseErr, "Stream Name not provided"));
              _context.next = 3;
              return _connectionManager["default"].create(config);

            case 3:
              connection = _context.sent;
              _context.prev = 4;
              _context.next = 7;
              return connection.readStreamEventsForward(streamName, 0, 1, true, config.credentials);

            case 7:
              slice = _context.sent;

              if (!(slice.status === _nodeEventstoreClient["default"].sliceReadStatus.StreamDeleted)) {
                _context.next = 10;
                break;
              }

              throw new Error("Stream hard deleted");

            case 10:
              if (!(slice.status === _nodeEventstoreClient["default"].sliceReadStatus.StreamNotFound)) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return", false);

            case 12:
              return _context.abrupt("return", true);

            case 13:
              _context.prev = 13;
              connection.releaseConnection();
              return _context.finish(13);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4,, 13, 16]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports["default"] = _default;
module.exports = exports.default;