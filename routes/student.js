
//import postgresql.js
var db = require("./postgresql");

//import module fs(file system)
var fs = require("fs");

//import handlebars to render
var handlebars = require("handlebars");

//to set path import path module
var path = require("path");

//future use
var curr='/student';

function check(type){
    if(type==="student") return true;
    else return false;
}

module.exports = function(routes,session) {

    // "/" to display user.html as it is in student route already 
    routes.get('/', function(req, res){

        console.log("student "+req.session.user+" page request");//debug

        if(check(req.session.type)) {
            //render given value to the specified place using key
            var data = {username:req.session.user};
            res.render('student',data);

        }

        else {

            //without login so redirect to login page
            res.redirect('/');

        }

    });
    
    //AJAX request /report to get student report
    routes.get('/report',function(req,res){

        if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /student/report");//debug

            //refer postgresql.js
            db.student_mark(req.session.user,req.query.sem,req.session.db,function(result){

                if(result){

                    res.status(200).send(result);

                }
                else{

                    res.send("error");

                }
            });
        }
    });

    //AJAX request /gpa to get student gpa
    routes.get('/gpa',function(req,res){

        console.log(req.session.user+" AJAX /student/gpa");//debug

        //refer postgresql.js
        db.student_gpa(req.session.user,req.session.db,function(result){

            if(result){

                res.status(200).send(result);

            }
            else{

                res.send("error");

            }

        });

    });

    //AJAX request /cgpa to get cgpa
    routes.get('/cgpa',function(req,res){

        console.log(req.session.user+" AJAX /student/cgpa");
        db.cgpa(req.session.user,8,req.session.db,function(empty , result){

            if(result){

                console.dir(result)
                res.status(200).send(result);

            }

            else{

                res.send("error");

            }
        });
    });

    //AJAX request /credits to get student credits
    routes.get('/credits',function(req,res){

        if(check(req.session.type)){//check user
            console.log(req.session.user+" AJAX /student/credits");//debug

            //refer postgresql.js
            db.sem_credits_all(req.session.user,req.session.db,function(result){

                if(result){
                    res.status(200).send(result);
                }
                else{
                    res.send("error");
                }
            });
        }
        else{

            res.redirect('/');

        }
    });

    //rest of the request under the path /students
    routes.get('*',function(req, res) {
        console.log(req.session.user+" AJAX /student/----");
        res.send("<h1>ERROR</h1>");
    });
    
}