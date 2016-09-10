var db = require("./postgresql");
//import module fs(file system)
var fs = require("fs");
//import handlebars to render
var Handlebars = require("handlebars");
//import body-parser for parsing request and json.
var bodyParser = require("body-parser");
//to set path import path module
var path = require("path");

var sync = require("synchronize");

var zipper = require("./zip_test.js");

//future use
var curr='/admin';
function check(type){
    if(type==="admin") return true;
    else return false;
}
    
module.exports = function(routes,session) {
    routes.use(bodyParser());
    
    // "/" to display user.html as it is in student route already 
    
    routes.get('/', function(req, res){
        console.log("admin "+req.session.user+" page request");//debug
        if(check(req.session.type)) {
            var page = fs.readFileSync(path.join(__dirname,'/views/admin.html'));
            
            var template = Handlebars.compile(page.toString());
                
            var item_c = 0;
            
            Handlebars.registerHelper('even-item', function() {
                item_c += 1;
                return item_c%2?" list-even":"";
            });
            
            Handlebars.registerHelper('qo', function(options) {
                return "'" + options.fn(this) + "'";
            });
            db.getBatch(req.session.user,'history','',function(n,val){
                var result={};
                result["batch"] = val;
                result["username"] = req.session.user;
                var html = template(result);
                res.send(html);
            });
        }
        else {
            //without login so redirect to login page
            res.redirect('/');
        }
      
    });
    routes.get('/batch-list', function(req, res) {
        if(check(req.session.type)) {
            if(req.query.query) {
                db.getBatch(req.session.user,'history',req.query.query,function(n,result){
                    res.send({"batch":result});
                });
            }
            else {          //if req sent without query
                db.getBatch(req.session.user,'history','',function(n,result){
                    res.send({"batch":result}) ;
                });
            }
        }
    });

    routes.get('/batch-add', function(req, res) {
       
       if(check(req.session.type)) {
            
            db.addBatch(req.session.user,req.query.batch,function(val){
                
                res.send(val);
                
            });
           
       } 
       
    });
    
    routes.get('/batch-edit', function(req, res) {
       
       if(check(req.session.type)) {
            
            db.searchBatch(req.session.user,'history',req.query.batch,function(val){
                
                res.send(val[0]);
                
            });
           
       } 
       
    });
    
    routes.post('/batch-edit', function(req, res) {
       
       if(check(req.session.type)) {
            
            db.editBatch(req.session.user,'history',req.body,function(val){
                
                res.send(val);
                
            });
           
       } 
       
    });
    
    
    routes.post('/batch-delete', function(req, res) {
        console.log('request to delete the batch');
        
        if(check(req.session.type) && req.body.key == "123456abcd") {
            
            db.dropBatch(req.session.user,req.body.batch,function(val){
                
                res.send({"success":true})
            
            });
        }
    });
    routes.get('/download-csv', function(req, res) {
        if(check(req.session.type)){
            db.backup(req.session.user,req.query.batch,'/home/ubuntu/workspace/vig-temp/public/dumb/sup/'
            ,
            function(val){
                if(val==true){
                    console.dir(__dirname);
                    zipper.zipIt('his',function(val){
                        var file = __dirname+'/public/dumb/his.zip';
                        res.download(file);
                    });
                }
            });
        }
    });
    
    
    routes.get('/download-sql', function(req, res) {
        if(check(req.session.type)){
            var h = req.query.batch;
            var sys = require('sys')
            var exec = require('child_process').exec;
            function puts(error, stdout, stderr) { 
                sys.puts(stdout)
                var file = __dirname+'/public/dumb/'+h+'.sql';
                res.download(file);
            }
            exec("PGPASSWORD='enter' pg_dump -U ramki -h localhost "+h+" -f /home/ubuntu/workspace/vig-temp/public/dumb/"+h+".sql", puts);
            
        }
    });
    
    routes.get('/user-html', function(req, res){
        if(check(req.session.type)){
            
            var batch_list = {};
            sync.fiber(function() {
                sync.parallel(function(){
                    
                    db.getCurBatch(req.session.user,'history','',sync.defer())
                    db.getDept(req.session.user,'history',sync.defer())
                    db.searchBothUser(req.session.user,'history','','both',0,{},sync.defer())
                    
                });
            var ans = sync.await();
            batch_list["users"] = ans[2];
            batch_list["dept"] = ans[1];
            batch_list["batches"] = ans[0];
            var page = fs.readFileSync(path.join(__dirname,'/views/admin_user.html'));
            var template = Handlebars.compile(page.toString());
            var item_c = 0;
            
            Handlebars.registerHelper('even-item', function() {
                item_c += 1;
                return item_c%2?" list-even":"";
            });
            Handlebars.registerHelper('qo', function(options) {
                return "'" + options.fn(this) + "'";
            });
            var html = template(batch_list);
            res.send(html);
            })
            
        }
    });
    
    routes.get('/user-list', function(req, res) {
        if(check(req.session.type)) {
            if(req.query.from>-1){
                var qur = req.query.query;
                if(qur==null){
                    qur = '';
                }
                db.searchBothUser(req.session.user,'history',qur,req.query.type,req.query.from,{},function(n,val){
                    if(val){
                        var result = {};
                        result["users"]=val;
                        res.send(result);
                    }
                    else{
                        res.send(404);
                    }
                });
            }
            else {
                res.send(404);
                //res.end();
            }
        }
    });
    routes.post('/user-add', function(req, res) {
        req.body.passwd = req.body.id;
      if(check(req.session.type)) {
        if(req.body.type == "student"){
            db.addStudent(req.session.user,'history',req.body,function(val){
                
                res.send(val);
            });
        }
        else if(req.body.type=="teacher"){
            db.addTeacher(req.session.user,'history',req.body,function(val){
                res.send(val);
            });
        }
        else {
          console.dir(req.query);
          res.send(404);
        }
      }
    });
    routes.get('/user-edit', function(req, res) {
        if(check(req.session.type)) {
            db.searchBothUser(req.session.user,'history',req.query.id,"both",0,{},function(n,val){
                if(val){
                    var result = {};
                    result = val[0];
                    res.send(result);
                }
                else{
                    res.send(404);
                }
            });
        }
        else {
            res.send(404);
            //res.end();
        }
    });
    routes.post('/user-edit', function(req, res) {
        var result = {};
        if(check(req.session.type)) {
            if(req.body.resetPasswd==1){
                db.resetPasswd(req.session.user,'history',req.body.id,function(val){
                    result = val;
                });
            }
            if(req.body.type=="student"){
                console.log("edit---student");
                db.editStudent(req.session.user,'history',req.body,function(val){
                    if(val){
                        if(result["success"]==false){
                            res.send(result);
                        }
                        else{
                        result = val;
                        res.send(result);
                        }
                    }
                    else{
                        res.send(404);
                    }
                });
            }
            else{
                console.log("edit---teacher");
                db.editTeacher(req.session.user,'history',req.body,function(val){
                    if(val){
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
                });
            }
        }
        else {
            res.send(404);
            //res.end();
        }
    });
    routes.get("/user-delete", function(req, res) {
        if(check(req.session.type)) {
            if(req.query.type=="student"){
                console.log("delete---student");
                db.deleteStudent(req.session.user,'history',req.query.id,function(val){
                    if(val){
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
                });
            }
            else if(req.query.type=="teacher"){
                console.log("delete---teacher");
                db.deleteStudent(req.session.user,'history',req.query.id,function(val){
                    if(val){
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
                });
            }
            else{
                res.send(404);
            }
        }
      else {
          res.redirect("/");
        }
    });
    routes.get("/subject-html", function(req, res) {
        var batch_list = {};
        if(check(req.session.type)) {
            var page = fs.readFileSync(path.join(__dirname,'/views/admin_subject.html'));
            
            db.getCurBatch(req.session.user,'history','',function(n, val) {
                if(val){
                    batch_list["batches"]=val;
                    var template = Handlebars.compile(page.toString());
            
                    var item_c = 0;
            
                    Handlebars.registerHelper('even-item', function() {
                        item_c += 1;
                        return item_c%2?" list-even":"";
                    });
            
                    Handlebars.registerHelper('qo', function(options) {
                        return "'" + options.fn(this) + "'";
                    });
            
                    var html = template(batch_list);
                
                    res.send(html);
                }
                else{
                    res.send(404);
                }
            });
          }
    });
    
    routes.get('/subject-list', function(req, res) {
      if(check(req.session.type)) {
            var result = {};
            if(req.query.query){}
            else{req.query.query='';}
            db.searchSubject(req.session.user,req.query.batch,''+req.query.query,req.query.from,function(val){
                    result["subjects"]=val;
                    if(val){
                        res.send(result);
                    }
                    else{
                        res.send(404);
                    }
            });
        }
    });
    routes.post('/subject-add', function(req, res) {
      if(check(req.session.type)){
            console.dir(req.body);
            db.addSubject(req.session.user,req.body.batch,req.body,function(val){
                    console.dir(val);
                    if(val){
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
            });
        }
    });
    routes.get('/subject-edit', function(req, res) {
      if(check(req.session.type)) {
            var result = {};
            if(req.query.query){}
            else{req.query.query='';}
            db.searchSubject(req.session.user,req.query.batch,''+req.query["sub_code"],0,function(val){
                    result["sub_code"]=val[0]["sub_code"];
                    result["sub_name"]=val[0]["SUBJECT_NAME"];
                    result["sub_credits"] =val[0]["CREDITS"];
                    console.dir(val);
                    if(val){
                        res.send(result);
                    }
                    else{
                        res.send(404);
                    }
            });
        }
    });
    routes.post('/subject-edit', function(req, res) {
      if(check(req.session.type)) {
            db.editSubject(req.session.user,req.body.batch,req.body,function(val){
                    
                    if(val){
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
            });
        }
    });
    routes.get('/subject-delete', function(req, res) {
      if(check(req.session.type)) {
            if(req.query.query){}
            else{req.query.query='';}
            db.deleteSubject(req.session.user,req.query.batch,req.query.sub_code,function(val){
                    
                    if(val){
                        res.send(val.toString());
                    }
                    else{
                        res.send(404);
                    }
            });
        }
    });
    routes.get("/assign-html", function(req, res) {
        if(check(req.session.type)){
            var batch_list = {};
            sync.fiber(function() {
                sync.parallel(function(){
                    
                    db.getCurBatch('2010_34','history','',sync.defer());
                    db.getDept('2010_34','history',sync.defer());
                    db.searchBothUser('Admin1','history','','teacher',0,{},sync.defer());
                    
                });
            var ans = sync.await();
            batch_list["users"] = ans[2];
            batch_list["dept"] = ans[1];
            batch_list["batches"] = ans[0];
            var page = fs.readFileSync(path.join(__dirname,'/views/admin_assign.html'));
            var template = Handlebars.compile(page.toString());
            var item_c = 0;
            
            Handlebars.registerHelper('even-item', function() {
                item_c += 1;
                return item_c%2?" list-even":"";
            });
            Handlebars.registerHelper('qo', function(options) {
                return "'" + options.fn(this) + "'";
            });
            var html = template(batch_list);
            res.send(html);
            });
            
        }
    });
    routes.get('/assign-list',function(req,res){
        db.searchBothUser('Admin1','history',req.query.query,'teacher',0,req.query,function(n, val) {
            var result = {};
            result["users"]=val;
            res.send(result);
        });
    });
    routes.post('/assign-stud-list',function(req,res){
        if(check(req.session.type)){
        db.getStudent('Admin1','history',req.body,function(n, val) {
            if(val){
            res.send(val);
            }
            else{
                res.send(404);
            }
        });
        }
        else{
            res.send(404);
        }
    });
    routes.post('/assign-assign', function(req, res) {
        if(check(req.session.type)) {
            if(req.body.type=="class_advisor"){
                sync.fiber(
                    function() {
                        var c = sync.await(db.getAssigned(req.session.user,'history',req.body,sync.defer()));
                        console.dir(c);
                        if(c[0]["CLASS_ADVISOR"]==null){
                            var result = sync.await(db.assignClassadv(req.session.user,'history',req.body,sync.defer()));
                            console.dir(result);
                            res.send(result);
                        }
                        else{
                            res.send({"error_text":"already assigned please deassign teacher to assign"});
                        }
                    }
                );
            }
            else if(req.body.type=="faculty_advisor"){
                sync.fiber(
                    function() {
                        if(typeof(req.body.stud)!='object'){
                            req.body.stud=[req.body.stud];
                        }
                        var c = sync.await(db.getAssigned(req.session.user,'history',req.body,sync.defer()));
                        console.log("------await");
                        console.dir(c);
                        if(c[0]["FACULTY_ADVISOR"]==null){
                            var result = sync.await(db.assignFacadv(req.session.user,'history',req.body,sync.defer()));
                            console.dir(result);
                            res.send(result);
                        }
                        else{
                            res.send({"error_text":"already assigned please deassign teacher to assign"});
                        }
                    }
                );
            }
            else if(req.body.type=="subject_teacher"){
                db.setSubjectBatch(req.session.user,req.body.batch,req.body,function(val){});
                db.setSubjectHistory(req.session.user,'history',req.body,function(val){
                   res.send(val); 
                });
            }
        }
    });
    routes.get("/assign-show", function(req, res) {
        if(check(req.session.type)) {
            sync.fiber(function() {
              sync.parallel(function(){
                   
                db.showClassadv('Admin1','history',req.query,sync.defer());
                db.showFacadv('Admin1','history',req.query,sync.defer());
                db.showSubjectTeach('Admin1','history',req.query,sync.defer());
                
              });
              var ans = sync.await();
              var k =[].concat.apply([], ans);
              res.send({"id":req.query.id,"assignments":k});
            })
        }
        else {
            res.error(404);
        }
    });
    routes.post('/assign-deassign', function(req, res) {
        if(check(req.session.type)) {
            if(req.body.role=="Class Advisor"){
                db.deassignClassadv(req.session.user,'history',req.body,function(n,val){
                    
                    if(val){
                        console.dir(val)
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
            });
            }
            else if(req.body.role=="Faculty Advisor"){
                db.deassignFacadv(req.session.user,'history',req.body,function(n,val){
                    
                    if(val){
                        console.dir(val)
                        res.send(val);
                    }
                    else{
                        res.send(404);
                    }
            });
            }
            else if(req.body.role=="Subject Teacher"){
                var result;
                db.deassignSubjectBatch(req.session.user,req.body.batch,req.body,function(val){ result = val["error_text"]});
                db.deassignSubjectHistory(req.session.user,'history',req.body,function(val){
                    if(result){
                        val["success"]='false';
                        val["error_text"]=result;
                        res.send(val)
                    }
                    else{
                        res.send(val);
                    }
                });
            }
        }
    });
    
};