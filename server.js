var stat = require('node-static'),
    req = require('request'),
    fileServer = new stat.Server('./web'),
    http = require('http'),
    _ = require("lodash"),
    util = require("util");

var mainServer = function (request, response) {
    fileServer.serve(request, response, function (e, res) {

        if (e && (e.status === 404)) { // If the file wasn't found
            fileServer.serveFile('/index.html', 200, {}, request, response);
        }
    });
    request.resume();
};
http.createServer(mainServer).listen(process.env.PORT || 80);