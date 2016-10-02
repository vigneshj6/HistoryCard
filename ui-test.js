
console.info("hisc-ui-testing node has been started.");

var xprs = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var bb = require("express-busboy");

var path = require("path");
var fs = require("fs");
var session = require("express-session");
var Hb = require('handlebars');

var app = xprs();
app.use(xprs.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*
bb.extend(app, {
    upload: true,
    path: 'temp/'
});
*/

app.use(session({secret: '1234567890QWERTY'}));

var port = 8082;
app.listen(port, function() {
    console.log("node is listening at port " + port);
});

var Hb_item_c = 0;
Hb.registerHelper('even-item', function() {
    Hb_item_c += 1;
    return item_c%2?" list-even":"";
});

function file2str(cwd_path) {
    var full_path = path.join(__dirname, cwd_path);
    var data = fs.readFileSync(full_path);
    return data.toString();
}

function hb2html(template_path, json_path) {

    var template_data = file2str(template_path);

    if(json_path) {
        var json_obj =  JSON.parse(file2str(json_path));
    }
    else {
        var json_obj = {}
    }
    
    return Hb.compile(template_data)(json_obj);
}

app.get('/', function(req, res) {
    console.log("HTTP GET request to - /");
    
    if(req.session) {
        res.redirect("/user");     
    }
    else {
        res.redirect("/login");
    }        
});

app.get('/login', function(req, res) {
    console.log("HTTP GET request to - /login");
    
    var data = hb2html("/test-data/login.hbs");
    res.send(data);
});

app.post('/login', function(req, res) {
    console.log("HTTP POST request to - /login");
    var usr = req.body.usr;
    var pass = req.body.pass;

    if (usr === "test1" && pass === "enter") {
        req.session.user = req.body.usr;
        res.redirect("/user");
    }
    else {
        var data = hb2html("/test-data/login.hbs", "/test-data/hbs-context/login_error.json");
        res.send(data);
    }
});

app.get('/logout', function(req, res) {
    console.log("HTTP GET request to - /logout");
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/login');
        }
    });
});


app.get('/user', function(req, res) {
    console.log("HTTP GET request to - /user");

    if(req.session.user) {
        var data = Hb.compile(file2str("/views/teacher.handlebars"))({
            username : req.session.user
        });

        res.send(data);
    }
    else {
        res.redirect('/login');
    }
});

app.get('/teacher/role-list', function(req, res) {
    console.log("HTTP GET request to - /role-list");

    if(req.session.user) {
        var json_obj = JSON.parse(file2str("/test-data/ajax-res/role.json"));
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});

app.get('/teacher/dashboard-html', function(req, res) {
    console.log("HTTP GET request to - /dashboard-html");

    if(req.session.user) {
        if(req.query.role === "facultyAdv") {
            var html = file2str("/views/teacher-faculty.handlebars");
            res.send(html);
        }
        else if(req.query.role === "classAdv") {
            var html = file2str("/views/teacher-class.handlebars");
            res.send(html);
        }
        else if(req.query.role === "subTeach") {
            var html = file2str("/views/teacher-subject.handlebars");
            res.send(html);
        }
        else {
            res.send(404);
        }
    }
    else {
        res.send(404);
    }
});

app.get('/teacher/stud-list', function(req, res) {
    console.log("HTTP GET request to - /stud-list");

    if(req.session.user) {
        var json_obj = JSON.parse(file2str("/test-data/ajax-res/studList.json"));
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});

app.get('/teacher/report-hc', function(req, res) {
    console.log("HTTP GET request to - /report-hc");

    if(req.session.user) {
        var json_obj = JSON.parse(file2str("/test-data/ajax-res/reportHc.json"));
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});

app.get('/teacher/report-credits', function(req, res) {
    console.log("HTTP GET request to - /report-credits");

    if(req.session.user) {
        var json_obj = JSON.parse(file2str("/test-data/ajax-res/reportCredits.json"));
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});

app.get('/teacher/report-cgpa', function(req, res) {
    console.log("HTTP GET request to - /report-cgpa");

    if(req.session.user) {
        if(req.query.rrn === '130071601097') {
            res.send({'cgpa': 8.9});
        }
        else {
            res.send({'cgpa': 9.1});
        }
    }
    else {
        res.send(404);
    }
});


app.get('/teacher/report-mark-att', function(req, res) {
    console.log("HTTP GET request to - /report-mark-att");

    if(req.session.user) {
        var json_obj;
        if(req.query.role === 'classAdv') {
            json_obj = JSON.parse(file2str("/test-data/ajax-res/report-mark-att.json"));
        }
        else if(req.query.role === 'subTeach') {
            json_obj = JSON.parse(file2str("/test-data/ajax-res/report-mark-att-sub.json"));
        }
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});

app.post('/teacher/report-mark-att', function(req, res) {
    console.log("HTTP POST request to - /report-mark-att");

    if(req.session.user) {
        console.dir(req.body.table_data);
        var json_obj = {success : true};
        res.send(json_obj);
    }
    else {
        res.send(404);
    }
});
