var express = require('express');
var app = express();

var wikiRouter = require('./wiki');

app.use('/wiki', wikiRouter);

app.all('/', function (req, res, next) {
  console.log('router: / /wiki /wiki/about');
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000');
  console.log('Open http://localhost:3000');
});
