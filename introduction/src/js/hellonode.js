// load HTTP module
let http = require('http')

// create HTTP Server and listen to port 8000
http.createServer(function(request, response) {

  // Sets the HTTP header response with HTTP status and content type
  response.writeHead(200, {'Content-Type': 'text/plain'});

  // send response body "Hello World"
  response.end('Hello World\n');
}).listen(8000);

// output URL for server accesses
console.log('Server running at http://127.0.0.1:8000/');
