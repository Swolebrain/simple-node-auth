var port = 3001;
var express = require('express');
var app = express();
var path = require('path');

app.get("/", function(req, res){
  res.sendFile(path.resolve("../views/register.html"));
});


app.listen(port);