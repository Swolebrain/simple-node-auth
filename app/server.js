var port = 3001;
var express = require('express');
var app = express();
var path = require('path');

app.use( express.static('../views'));
//more info on serving static files:
// http://expressjs.com/en/starter/static-files.html

app.get("/", function(req, res){
  res.sendFile(path.resolve("../views/register.html"));
});


app.listen(port);