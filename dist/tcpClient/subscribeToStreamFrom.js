"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _connectionManager = _interopRequireDefault(require("./connectionManager"));

var _mapEvents = _interopRequireDefault(require("./utilities/mapEvents"));

var _nodeEventstoreClient = _interopRequireDefault(require("node-eventstore-client"));

var _debug = _interopRequireDefault(require("debug"));

var _assert = _interopRequireDefault(require("assert"));

var debug = (0, _debug["default"])('geteventstore:subscribeToStreamFrom');
var baseErr = 'Subscribe to Stream From - ';

var _default = function _default(config) {
  return function (streamName, fromEventNumber, onEventAppeared, onLiveProcessingStarted, onDropped, settings) {
    settings = settings || {};
    return new Promise( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve, reject) {
        var connection, onEvent, onConnected;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (0, _assert["default"])(streamName, "".concat(baseErr, "Stream Name not provided"));
                if (!fromEventNumber) fromEventNumber = -1;

                onEvent = function onEvent(sub, ev) {
                  var mappedEvent = (0, _mapEvents["default"])([ev])[0];
                  if (mappedEvent) onEventAppeared(sub, mappedEvent);
                };

                onConnected = /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                    var subscription;
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return connection.subscribeToStreamFrom(streamName, fromEventNumber, settings.resolveLinkTos, onEvent, onLiveProcessingStarted, onDropped, new _nodeEventstoreClient["default"].UserCredentials(config.credentials.username, config.credentials.password), settings.readBatchSize);

                          case 3:
                            subscription = _context2.sent;
                            subscription.close = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                              return _regenerator["default"].wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      subscription.stop();
                                      _context.next = 3;
                                      return connection.releaseConnection();

                                    case 3:
                                      _context.next = 5;
                                      return _connectionManager["default"].close(config)(subscription._connection._connectionName);

                                    case 5:
                                    case "end":
                                      return _context.stop();
                                  }
                                }
                              }, _callee);
                            }));
                            debug('', 'Subscription: %j', subscription);
                            resolve(subscription);
                            _context2.next = 12;
                            break;

                          case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](0);
                            reject(_context2.t0);

                          case 12:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, null, [[0, 9]]);
                  }));

                  return function onConnected() {
                    return _ref2.apply(this, arguments);
                  };
                }();

                _context3.prev = 4;
                _context3.next = 7;
                return _connectionManager["default"].create(config, onConnected, true);

              case 7:
                connection = _context3.sent;
                _context3.next = 13;
                break;

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](4);
                reject(_context3.t0);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[4, 10]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };
};

exports["default"] = _default;
module.exports = exports.default;