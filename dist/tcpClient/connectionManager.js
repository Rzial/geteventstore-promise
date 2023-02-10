"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeEventstoreClient = require("node-eventstore-client");

var _genericPool = _interopRequireDefault(require("generic-pool"));

var _debug = _interopRequireDefault(require("debug"));

var _https = _interopRequireDefault(require("https"));

var debug = (0, _debug["default"])('geteventstore:connectionManager');
var _uniqueConfigConnectionPools = []; // TODO: Remove terrible temporary hack till workaround can be found or tcp library support is added 

var connectWithoutValidation = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client) {
    var httpsRejectUnauthorizedPriorValue;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            httpsRejectUnauthorizedPriorValue = _https["default"].globalAgent.options.rejectUnauthorized;
            _context.prev = 1;
            _https["default"].globalAgent.options.rejectUnauthorized = false;
            _context.next = 5;
            return client.connect();

          case 5:
            _context.prev = 5;
            _https["default"].globalAgent.options.rejectUnauthorized = httpsRejectUnauthorizedPriorValue;
            return _context.finish(5);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1,, 5, 8]]);
  }));

  return function connectWithoutValidation(_x) {
    return _ref.apply(this, arguments);
  };
}();

var isConnectionClosed = function isConnectionClosed(client) {
  return client._handler._state === 'closed';
};

var createConnectionPool = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(config, onConnected, isSubscription) {
    var opts, connectionPool;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            opts = config.poolOptions || {
              autostart: false
            };

            if (isSubscription) {
              opts.min = 0;
              opts.max = 1;
            }

            connectionPool = {
              config: config,
              onConnected: onConnected,
              pool: _genericPool["default"].createPool({
                create: function create() {
                  var _this = this;

                  return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                    var client;
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.t0 = _nodeEventstoreClient.createConnection;
                            _context2.t1 = config;
                            _context2.t2 = config.gossipSeeds || "".concat(config.protocol, "://").concat(config.hostname, ":").concat(config.port);
                            _context2.t3 = config.connectionNameGenerator;

                            if (!_context2.t3) {
                              _context2.next = 8;
                              break;
                            }

                            _context2.next = 7;
                            return config.connectionNameGenerator();

                          case 7:
                            _context2.t3 = _context2.sent;

                          case 8:
                            _context2.t4 = _context2.t3;
                            client = (0, _context2.t0)(_context2.t1, _context2.t2, _context2.t4);
                            // TODO: remove temporary hack when tcp library supports https
                            if (config.useSslConnection) client._endpointDiscoverer._httpService = _https["default"];

                            if (isSubscription) {
                              connectionPool.connectionName = client._connectionName;

                              _uniqueConfigConnectionPools.push(connectionPool);
                            }

                            client.releaseConnection = function () {
                              return connectionPool.pool.release(client);
                            };

                            if (onConnected) {
                              client.once('connected', function () {
                                debug('', "".concat(client._connectionName, " - Connection Connected"));
                                return onConnected();
                              });
                            } else {
                              client.on('connected', function () {
                                return debug('', "".concat(client._connectionName, " - Connection Connected"));
                              });
                            }

                            client.on('disconnected', function () {
                              return debug('', "".concat(client._connectionName, " - Connection Disconnected"));
                            });
                            client.on('reconnecting', function () {
                              return debug('', "".concat(client._connectionName, " - Connection Reconnecting..."));
                            });
                            client.on('closed', function (reason) {
                              debug('', "".concat(client._connectionName, " - Connection Closed: ").concat(reason));
                              connectionPool.pool.destroy(client)["catch"](function () {}); //Do Nothing
                            });
                            client.on('error', function (err) {
                              debug('', "".concat(client._connectionName, " - Connection Error: ").concat(err.stack));
                              console.error("".concat(client._connectionName, " - EventStore: ").concat(err.stack));

                              try {
                                _this.destroy(client);
                              } catch (ex) {//Do nothing
                              }
                            });

                            if (!(config.useSslConnection && !config.validateServer)) {
                              _context2.next = 23;
                              break;
                            }

                            _context2.next = 21;
                            return connectWithoutValidation(client);

                          case 21:
                            _context2.next = 25;
                            break;

                          case 23:
                            _context2.next = 25;
                            return client.connect();

                          case 25:
                            return _context2.abrupt("return", client);

                          case 26:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }))();
                },
                destroy: function destroy(client) {
                  return client.close();
                }
              }, opts)
            };
            if (!isSubscription) _uniqueConfigConnectionPools.push(connectionPool);
            return _context3.abrupt("return", connectionPool);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function createConnectionPool(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  create: function create(config, onConnected) {
    var _arguments = arguments;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var isSubscription, connectionPool, client;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              isSubscription = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : false;
              connectionPool = _uniqueConfigConnectionPools.find(function (pool) {
                return pool.config === config && pool.onConnected === onConnected;
              });

              if (!(!connectionPool || isSubscription)) {
                _context4.next = 6;
                break;
              }

              _context4.next = 5;
              return createConnectionPool(config, onConnected, isSubscription);

            case 5:
              connectionPool = _context4.sent;

            case 6:
              _context4.next = 8;
              return connectionPool.pool.acquire();

            case 8:
              client = _context4.sent;

              if (!isConnectionClosed(client)) {
                _context4.next = 20;
                break;
              }

              _context4.prev = 10;
              _context4.next = 13;
              return connectionPool.pool.destroy(client);

            case 13:
              _context4.next = 17;
              break;

            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](10);

            case 17:
              _context4.next = 19;
              return connectionPool.pool.acquire();

            case 19:
              client = _context4.sent;

            case 20:
              return _context4.abrupt("return", client);

            case 21:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[10, 15]]);
    }))();
  },
  closeAllPools: function closeAllPools() {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return Promise.all(_uniqueConfigConnectionPools.map(function (connectionPool) {
                return connectionPool.pool.clear();
              }));

            case 2:
              _uniqueConfigConnectionPools.splice(0, _uniqueConfigConnectionPools.length);

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  },
  close: function close(config) {
    var _this2 = this;

    return /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(connectionName) {
        var pool, poolIndex;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _this2.getPool(config)(connectionName);

              case 2:
                pool = _context6.sent;
                _context6.next = 5;
                return pool.drain();

              case 5:
                _context6.next = 7;
                return pool.clear();

              case 7:
                poolIndex = _uniqueConfigConnectionPools.findIndex(function (_connectionPool) {
                  return _connectionPool.pool === pool;
                });
                if (poolIndex !== -1) _uniqueConfigConnectionPools.splice(poolIndex, 1);

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      return function (_x5) {
        return _ref3.apply(this, arguments);
      };
    }();
  },
  getPool: function getPool(config) {
    return /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(connectionName) {
        var connectionPool;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                connectionPool = _uniqueConfigConnectionPools.find(function (pool) {
                  return pool.config === config || pool.connectionName && pool.connectionName === connectionName;
                });

                if (connectionPool) {
                  _context7.next = 3;
                  break;
                }

                throw new Error("Connection Pool not found");

              case 3:
                return _context7.abrupt("return", connectionPool.pool);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      return function (_x6) {
        return _ref4.apply(this, arguments);
      };
    }();
  }
};
exports["default"] = _default;
module.exports = exports.default;