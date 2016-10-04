var db = require("./postgresql");
//future use
var curr='/teacher';


var sync = require("synchronize");

function check(type){
    if(type==="teacher") return true;
    else return false;
}

module.exports = function(routes,session) {
    
    // "/" to display user.html as it is in student route already 
    routes.get('/', function(req, res){
        console.log("teacher "+req.session.user+"page request");//debug
        if(check(req.session.type)) {
            var data={};
            data.username=req.session.user;
            res.render('teacher',data);
            //});
        }
        else {
            //without login so redirect to login page
            res.redirect('/');
        }
      
    });
    routes.get('/dashboard-html', function(req, res) {
    console.log("HTTP GET request to - /dashboard-html");

    if(check(req.session.type)) {
        if(req.query.role === "facultyAdv") {
            res.render('teacher-faculty');
        }
        else if(req.query.role === "classAdv") {
            res.render('teacher-class')
        }
        else if(req.query.role === "subTeach") {
            res.render('teacher-subject')
        }
        else {
            res.send(404);
        }
    }
    else {
        res.send(404);
    }
    });
    routes.get('/report-hc',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /teacher/report");//debug
            //refer postgresql.js
            db.student_mark(req.query.rrn,req.query.sem,req.session.batch,function(val){
                if(val){
                    var result = {};
                    result["report_hc"]=val["sub_record"];
                    result["gpa"]=val["gpa"];
                    res.send(result);
                }
                else{
                    res.send("error");
                }
            });
        } 
    });
    routes.get('/foss-graph',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /teacher/foss-graph");//debug
            //refer postgresql.js
            db.fossgraph(function(result){
                if(result){
                    res.status(200).send(result);
                }
                else{
                    res.send("error");
                }
            });
        } 
    });
    routes.get('/report-credits',function(req,res){
        if(check(req.session.type)){//check user
            console.log(req.query.rrn+" AJAX /teacher/credits"+req.session.batch+"batch");//debug
            //refer postgresql.js
            db.sem_credits_all(req.query.rrn,req.session.batch,function(result){
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
    //AJAX request /cgpa to get cgpa
    routes.get('/report-cgpa',function(req,res){
        console.log(req.query.rrn+" AJAX /teacher/cgpa");
        db.cgpa(req.query.rrn,8,req.session.batch,function(x,result){
            if(result){
                console.dir(result);
                res.status(200).send(result);
            }
            else{
                res.send("error");
            }
        });
    });
    
    // 
    routes.get("/role-list", function(req, res) {
        if(check(req.session.type)) {
            var data = {};
            data.id=req.session.user;
            sync.fiber(function() {
              sync.parallel(function(){
                   
                db.showClassadv('Admin1','history',data,sync.defer());
                db.showFacadv('Admin1','history',data,sync.defer());
                db.showSubjectTeach('Admin1','history',data,sync.defer());
                
              });
              var ans = sync.await();
              var k =[].concat.apply([], ans);
              res.send({"id":req.query.id,"assignments":k});
            })
        }
        else {
            res.redirect("/");
        }
    });
    routes.get('/stud-list',function(req, res) {
       if(check(req.session.type)){//check valid login or valid user
            console.log(req.session.user+" AJAX /stud-list");//debug
            //refer postgresql.js
            var data={};
            var querydata = {};
            querydata.id = req.session.user;
            querydata.type = req.query.role;
            req.session.batch = req.query.batch;
            db.get_stud_list(req.session.user,'history',querydata,function(val){
                if(val == {}){
                    
                }
                else{
                console.dir(val);
                data['stud'] = val;
                data.username=req.session.user;
                res.send(data);
                }
                //send to the client
            });
        }
    });
    routes.get('/report-mark-att',function(req,res){
        db.getCat1(req.session.user,req.session.batch,req.query,function(val){
            var tb = {};
            tb["table_data"]=val;
            res.send(tb);
        });
    });
    routes.post('/report-mark-att',function(req,res){
        var js = req.body["table_data"];
        console.dir(js)
        console.dir(js.toString())
        res.send({});
    });
};