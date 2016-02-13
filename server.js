var port = 3001;
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require("express-session");
var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'authentication'
});
connection.connect();


app.use(session({
  secret: 'qwertyuiop123567890',
  resave: false
})); /*This is not really great for production environment
    because it is impossible to scale your sessions to multiple
    servers. In production, you need a DB session store. */

app.use( express.static('views') );
app.use(   bodyParser.urlencoded( {extended: false} )   );
//more info on serving static files:
// http://expressjs.com/en/starter/static-files.html

app.get("/", function(req, res){
  if (req.session.isLoggedIn)
    res.sendFile(path.resolve("password-protected-views/members.html"));
  else
    res.sendFile(path.resolve("views/register.html"));
});

app.get("login", function(req, res){
  res.sendFile(path.resolve("views/login.html"));
});


//this is the route you can copy for any new files
app.get("/members", function(req, res){
  if (req.session.isLoggedIn)
    res.sendFile(path.resolve("password-protected-views/members.html"));
  else
    res.sendFile(path.resolve("views/login.html"));
});


//REGISTRATION ROUTE
app.post("/", function(req,res){
  //if they didn't send a username or didnt send a
  //password, respond with an error
  if (!req.body.username || !req.body.password){
    res.end("Username and password both required");
    return;
  }
  //this is to protect from SQL injection:
  req.body.username =  connection.escape(req.body.username);
  req.body.password =  connection.escape(req.body.password);
  req.body.email =  connection.escape(req.body.email);
  
  var hash = "'"+crypto
      .createHash("md5")
      .update(req.body.password)
      .digest('hex')+"'";
  
  var queryStr = "INSERT INTO users VALUES ("+
                  req.body.username+", "+
                  hash  +  ", "+
                  req.body.email+")";
  console.log(queryStr);
  connection.query(queryStr, function(err){
    if (err){
      res.end(JSON.stringify(err));
    }
    else{
      req.session.isLoggedIn = true;
      res.redirect("/members");
    }
  });
  
  
});

app.post("/login", function(req, res){
  //if username doesnt exist in user store, return error
  if (!req.body.username || !req.body.password){
    res.end("Username and password required");
    return;
  }
  req.body.username =  connection.escape(req.body.username);
  req.body.password =  connection.escape(req.body.password);
  var u = req.body.username;
  var query = "SELECT * FROM users WHERE username="+u;
  console.log("Issuing query: "+query);      
  connection.query(query, function(err, rows){
    if (err){
      res.end(JSON.stringify(err));
      return;
    }
    if (!rows || rows.length === 0){
      res.end("No user was found with that username.");
      return;
    }
    else{
      var hash = crypto
        .createHash("md5")
        .update(req.body.password)
        .digest('hex');
      console.log(rows);
      if (rows[0].hashedPassword === hash){
        req.session.isLoggedIn = true;
        console.log("User "+req.body.username+" logged in");
        res.redirect("/members");
      }
      else{
        res.end("Wrong password!");
      }
    }
  });
  
});



app.listen(port);
console.log("Server listening at port "+port);