var debug = require('debug')('geteventstore:sendShutdownCommand'),
    req = require('request-promise'),
    url = require('url');

module.exports = config => {
    var buildUrl = () => {
        var urlObj = JSON.parse(JSON.stringify(config));
        urlObj.pathname = '/admin/shutdown';
        return url.format(urlObj);
    };

    return () => {
        var options = {
            uri: buildUrl(),
            method: 'POST'
        };

        return req(options).then(response => {
            debug('', 'Response: %j', response);
            return response;
        });
    };
};