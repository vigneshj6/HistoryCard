var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

//load fs(file system) to fs
var fs = require("fs");
//session
var session = require("express-session");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/layouts')));
console.dir(__dirname);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


//session should be encrypted and the key is jkdha3423f34sf78h
app.use(session({secret: 'jkdha3423f34sf78'}));


//route /log request to rout
var rout = express.Router();
require("./routes/login.js")(rout,session);//pass rout and session to the module
app.use('/log*',rout);//include the function inside that module


//route /student to student.js 
var student = express.Router();
require("./routes/student.js")(student,session);//pass student and session to the module
app.use('/student',student);//include the function inside that module


var teacher = express.Router();
require("./routes/teacher.js")(teacher,session);//pass teacher and session to the module
app.use('/teacher',teacher);//include the function inside that module

var admin = express.Router();
var useless = require("./routes/administrator.js");
useless(admin,session);   //pass admin and session to the module
app.use('/admin',admin); // include the function inside that module

//get request to / show login page(index.html)
app.get('/', function(req, res){
    console.log("hello ");
    if(req.session.type){
        res.redirect("/"+req.session.type);
    }
    else{
      console.log("index page request");
      res.render('layouts/index');
    }
      
  });
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
