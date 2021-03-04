'use strict';

var http = require('http');
var fs = require('fs');

var allowList = ['valuesort.html', 'valuesort.css'];

http.createServer(function (request, response) {
		var filename = request.url.substring(1); // remove leading "/"
    
    if (filename !== "" && !allowList.includes(filename)) {
  		response.writeHead(404, {'Content-Type': 'text/plain'});
	    return response.end("404 Not Found");
  	} else if (filename === "") {
  		filename = "valuesort.html";
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
				                  '.js'   : 'text/javascript'
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