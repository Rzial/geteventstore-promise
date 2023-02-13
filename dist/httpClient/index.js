"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _getStreamSubscriptionsInfo = _interopRequireDefault(require("./persistentSubscriptions/getStreamSubscriptionsInfo"));

var _getAllSubscriptionsInfo = _interopRequireDefault(require("./persistentSubscriptions/getAllSubscriptionsInfo"));

var _getSubscriptionInfo = _interopRequireDefault(require("./persistentSubscriptions/getSubscriptionInfo"));

var _getEvents = _interopRequireDefault(require("./persistentSubscriptions/getEvents"));

var _getAllProjectionsInfo2 = _interopRequireDefault(require("./projections/getAllProjectionsInfo"));

var _assert = _interopRequireDefault(require("./persistentSubscriptions/assert"));

var _remove = _interopRequireDefault(require("./persistentSubscriptions/remove"));

var _sendScavengeCommand = _interopRequireDefault(require("./admin/sendScavengeCommand"));

var _sendShutdownCommand = _interopRequireDefault(require("./admin/sendShutdownCommand"));

var _createHttpClient = _interopRequireDefault(require("../utilities/createHttpClient"));

var _disableAll = _interopRequireDefault(require("./projections/disableAll"));

var _enableAll = _interopRequireDefault(require("./projections/enableAll"));

var _getState = _interopRequireDefault(require("./projections/getState"));

var _getResult = _interopRequireDefault(require("./projections/getResult"));

var _getAllStreamEvents = _interopRequireDefault(require("./getAllStreamEvents"));

var _getInfo = _interopRequireDefault(require("./projections/getInfo"));

var _checkStreamExists = _interopRequireDefault(require("./checkStreamExists"));

var _assert2 = _interopRequireDefault(require("./projections/assert"));

var _remove2 = _interopRequireDefault(require("./projections/remove"));

var _config2 = _interopRequireDefault(require("./projections/config"));

var _start = _interopRequireDefault(require("./projections/start"));

var _reset = _interopRequireDefault(require("./projections/reset"));

var _stop = _interopRequireDefault(require("./projections/stop"));

var _getEventsByType = _interopRequireDefault(require("./getEventsByType"));

var _deleteStream = _interopRequireDefault(require("./deleteStream"));

var _writeEvents = _interopRequireDefault(require("./writeEvents"));

var _writeEvent = _interopRequireDefault(require("./writeEvent"));

var _readEvents = _interopRequireDefault(require("./readEvents"));

var _getEvents2 = _interopRequireDefault(require("./getEvents"));

var _ping = _interopRequireDefault(require("./ping"));

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

var _assert3 = _interopRequireDefault(require("assert"));

var _url = _interopRequireDefault(require("url"));

var baseErr = 'geteventstore-promise - HTTP client - ';

var HTTPClient = function HTTPClient(config) {
  (0, _classCallCheck2["default"])(this, HTTPClient);
  (0, _assert3["default"])(config, "".concat(baseErr, "config not provided"));
  (0, _assert3["default"])(config.hostname, "".concat(baseErr, "hostname property not provided"));
  (0, _assert3["default"])(config.port, "".concat(baseErr, "port property not provided"));
  (0, _assert3["default"])(config.credentials, "".concat(baseErr, "credentials property not provided"));
  (0, _assert3["default"])(config.credentials.username, "".concat(baseErr, "credentials.username property not provided"));
  (0, _assert3["default"])(config.credentials.password, "".concat(baseErr, "credentials.password property not provided"));
  if (config.timeout) (0, _assert3["default"])(typeof config.timeout === 'number', "".concat(baseErr, "timeout not defined")); //Add additional internal configuration properties

  var _config = (0, _lodash["default"])(config);

  _config.protocol = _config.protocol || 'http';
  _config.auth = "".concat(_config.credentials.username, ":").concat(_config.credentials.password);
  _config.baseUrl = _url["default"].format(_config);
  if (_config.protocol === 'https') _config.validateServer = _config.validateServer === undefined || _config.validateServer === null ? true : _config.validateServer;
  var httpClient = (0, _createHttpClient["default"])(_config);

  var _getAllProjectionsInfo = (0, _getAllProjectionsInfo2["default"])(_config, httpClient);

  var _getConfig = (0, _config2["default"])(_config, httpClient);

  var _startProjection = (0, _start["default"])(_config, httpClient);

  var _stopProjection = (0, _stop["default"])(_config, httpClient);

  this.checkStreamExists = (0, _checkStreamExists["default"])(_config, httpClient);
  this.writeEvent = (0, _writeEvent["default"])(_config, httpClient);
  this.writeEvents = (0, _writeEvents["default"])(_config, httpClient);
  this.getAllStreamEvents = (0, _getAllStreamEvents["default"])(_config, httpClient);
  this.readEventsForward = (0, _readEvents["default"])(_config, httpClient, 'forward');
  this.readEventsBackward = (0, _readEvents["default"])(_config, httpClient, 'backward');
  this.getEvents = (0, _getEvents2["default"])(this.readEventsForward, this.readEventsBackward);
  this.getEventsByType = (0, _getEventsByType["default"])(this.getEvents);
  this.deleteStream = (0, _deleteStream["default"])(_config, httpClient, this.checkStreamExists);
  this.ping = (0, _ping["default"])(_config, httpClient);
  this.admin = {
    scavenge: (0, _sendScavengeCommand["default"])(_config, httpClient),
    shutdown: (0, _sendShutdownCommand["default"])(_config, httpClient)
  };
  this.projections = {
    start: _startProjection,
    stop: _stopProjection,
    reset: (0, _reset["default"])(_config, httpClient),
    remove: (0, _remove2["default"])(_config, httpClient),
    getAllProjectionsInfo: _getAllProjectionsInfo,
    getState: (0, _getState["default"])(_config, httpClient),
    getResult: (0, _getResult["default"])(_config, httpClient),
    config: (0, _config2["default"])(_config, httpClient),
    getInfo: (0, _getInfo["default"])(_getAllProjectionsInfo, _getConfig),
    assert: (0, _assert2["default"])(_config, httpClient, _getAllProjectionsInfo),
    disableAll: (0, _disableAll["default"])(_getAllProjectionsInfo, _stopProjection),
    enableAll: (0, _enableAll["default"])(_getAllProjectionsInfo, _startProjection)
  };
  this.persistentSubscriptions = {
    assert: (0, _assert["default"])(_config, httpClient),
    remove: (0, _remove["default"])(_config, httpClient),
    getEvents: (0, _getEvents["default"])(_config, httpClient),
    getSubscriptionInfo: (0, _getSubscriptionInfo["default"])(_config, httpClient),
    getAllSubscriptionsInfo: (0, _getAllSubscriptionsInfo["default"])(_config, httpClient),
    getStreamSubscriptionsInfo: (0, _getStreamSubscriptionsInfo["default"])(_config, httpClient)
  };
};

exports["default"] = HTTPClient;
module.exports = exports.default;