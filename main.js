//express server module
var xprs = require("express");

//load path to path
var path = require("path");

//load fs(file system) to fs
var fs = require("fs");

//session
var session = require("express-session");

//call object of module express
var app = xprs();

//use public folder as root for the client
//can only access files inside public
app.use(xprs.static('public'));


//session should be encrypted and the key is jkdha3423f34sf78h
app.use(session({secret: 'jkdha3423f34sf78'}));


//route /log request to rout
var rout = xprs.Router();
require("./login.js")(rout,session);//pass rout and session to the module
app.use('/log*',rout);//include the function inside that module


//route /student to student.js 
var student = xprs.Router();
require("./student.js")(student,session);//pass student and session to the module
app.use('/student',student);//include the function inside that module


var teacher = xprs.Router();
require("./teacher.js")(teacher,session);//pass teacher and session to the module
app.use('/teacher',teacher);//include the function inside that module

var admin = xprs.Router();
var useless = require("./administrator.js");
useless(admin,session);   //pass admin and session to the module
app.use('/admin',admin); // include the function inside that module

//listen port 8082
app.listen(8080,function(){
    console.log("listening");
});


//get request to / show login page(index.html)
app.get('/', function(req, res){
    if(req.session.type){
        res.redirect("/"+req.session.type);
    }
    console.log("index page request");
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

//TODO sign up and retrive password by hashing