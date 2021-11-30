// TODO: install nodejs and express
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('Hello Express!');
});

app.listen(8000, function() {
  console.log('Example app listening on port 8000');
  console.log('if host is localhost? http://localhost:8000')
})
