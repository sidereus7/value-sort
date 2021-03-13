'use strict';

const http = require('http');
const fs = require('fs');

var allowList = ['index.html', 'styles/valuesort.css', 'scripts/valuesort.js', 'valuecards.json'];

http.createServer(function (request, response) {
    var filename = request.url.substring(1); // remove leading "/"
    
    if (filename !== "" && !allowList.includes(filename)) {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      return response.end("404 Not Found");
    } else if (filename === "") {
      filename = "public/index.html";
    } else if (filename === "styles/valuesort.css") {
      filename = "public/styles/valuesort.css";
    } else if (filename === "scripts/valuesort.js") {
      filename = "public/scripts/valuesort.js";
    }

    var dotoffset = filename.lastIndexOf('.');
    var mimetype = dotoffset == -1
                      ? 'text/plain'
                      : {
                          '.html' : 'text/html',
                          '.ico'  : 'image/x-icon',
                          '.jpg'  : 'image/jpeg',
                          '.png'  : 'image/png',
                          '.gif'  : 'image/gif',
                          '.css'  : 'text/css',
                          '.js'   : 'text/javascript',
                          '.json' : 'application/json'
                          }[ filename.substring(dotoffset) ];

    fs.readFile(filename, function(err, data) {
      if (err) {
        response.writeHead(404, {'Content-Type': mimetype});
        return response.end("404 Not Found");
      }

      response.writeHead(200, {'Content-Type': mimetype});
      response.write(data);
      return response.end();
    });
}).listen(8080);