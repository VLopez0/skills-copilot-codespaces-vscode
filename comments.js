// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var path = url_parts.pathname;

  if (path == '/comments') {
    if (request.method == 'GET') {
      fs.readFile('comments.json', function(err, data) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(data);
        response.end();
      });
    }
    else if (request.method == 'POST') {
      var body = '';
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        var post = qs.parse(body);
        fs.readFile('comments.json', function(err, data) {
          var comments = JSON.parse(data);
          comments.push(post);
          fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(comments));
            response.end();
          });
        });
      });
    }
  }
  else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('Not Found');
  }
});

// Listen on port 8000, IP defaults to
