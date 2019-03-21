var express = require('express');
var app = express();

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.use('/',function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
