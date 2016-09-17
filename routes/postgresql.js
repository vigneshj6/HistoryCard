//import database.js
var db = require("./db");
//TODO
var bcrypt = require("bcrypt");
//import fs module
var fs = require("fs");
//to hash
//bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//Store hash in your password DB.
//});
var sync = require("synchronize");

//module to export functions in postgresql.jss in postgresql.js
module.exports = {
    init : function(cb){
        var client = db.dbconnect('');
        var credit_query=db.sql('init');
        console.log('working ... ');
        client.query('CREATE DATABASE "history"',function(er) {
            var client = db.dbconnect('history');
            var query = client.query(credit_query,function(err){
            cb(err);
        });
        });
        
    }
    ,
    //function name is sem_credits_all
    sem_credits_all : function(rrn,dbval,usercall){
        if(rrn.length==12){//validation
            //connect to specified database (refer database.js)
            var client = db.dbconnect(dbval);
            //refer database.js (sql function loads query to the variable)
            var credit_query=db.sql('sem_credits_all');
            //execute query
            var query = client.query(credit_query,[rrn]);
            var credit={};
            //row event(this function called when there is a row)
            query.on('row',function(val) {
                //to get json of this format sem<number>=value in credit
                credit["sem"+val['SEM_TAKEN']]=Number(val['sum']);
            });
            //end event(this function called at the end of the table)
            query.on('end',function(val){
                //runs callback and gives credit json
                client.end();
                usercall(credit);
            });
        }
    }
    ,
    cgpa : function(rrn,upto,dbval,usercall) {
        if(rrn.length==12){
            var client = db.dbconnect(dbval);
            var cgpa_query=db.sql('student_cgpa');
            var gpa={};
            var query = client.query(cgpa_query,[rrn,upto],function(err,result){
                if(err){
                    console.dir(err);
                }
                gpa=result.rows[0];
                usercall(null,gpa);
            });
        }
    }
    ,
    cgpa_graph : function(rrn,dbval,usercall){
        if(rrn.length==12){
            var i=1;
            module.exports.student_gpa(rrn,dbval,function(ival) {
                console.dir(ival);
            });
            var gpa=[];
            sync.fiber(function(){
                for(var i=1;i<9;i++){
                    gpa.push(sync.await(module.exports.cgpa(rrn,i,dbval,sync.defer())));
                }
                usercall(gpa);
            })
            };
            
    }
    ,
    student_credit : function(rrn,sem,dbval,usercall) {
        if(rrn.length==12){
            var client = db.dbconnect(dbval);
            var credits_query=db.sql('sem_credits');
            var query = client.query(credits_query,[rrn,sem]);
            var gpa={};
            query.on('row',function(val) {
                gpa=val;
                gpa['valid']=true;
            });
            query.on('end',function(val){
                client.end();
                usercall(gpa);
            });
        }
    }
    ,
    student_gpa : function(rrn,dbval,usercall){
        if(rrn.length==12){
            var client = db.dbconnect(dbval);
            var gpa_query=db.sql('student_gpa');
            var query = client.query(gpa_query,[rrn]);
            var gpa={};
            query.on('row',function(val) {
                gpa["sem"+val['SEM_TAKEN']]=val['GPA'];
            });
            query.on('end',function(val){
                usercall(gpa);
            });
        }
    }
    ,
    student_mark : function(rrn,sem,dbval,usercall){
        if(rrn && sem>0 && sem<9){
            var client = db.dbconnect(dbval);
            var result=[];
            var sen={};
            var gpa;
            var join_query=db.sql('student_cat');
            var query = client.query(join_query,[rrn,sem]);
            query.on('row', function(val) {
                result.push(val);
            });
            query.on('end',function(val) {
                sen['sub_record']=result;
                module.exports.student_gpa(rrn,dbval,function(gpa){
                    sen['gpa']=gpa["sem"+sem];
                    usercall(sen);
                });
            });
        }
    }
    ,
    fossgraph : function(usercall){
        var client = db.dbconnect('2013-2017');
        var join_query = db.sql('fossgraph');
        var query = client.query(join_query);
        var result = [];
        var sen = {};
            query.on('row', function(val) {
                result.push(val);
            });
            query.on('end',function(val) {
                    console.dir(result)
                    sen = result;
                    usercall(sen);
                });
        
    }
    ,
/*
loginhash : function(userid,pass){
    var client = db.dbconnect('history');
    var valid = false;
    var query = client.query("select * from login where userid=($1)",[userid]);
    query.on('row', function(val) {
        bcrypt.compare(pass,val['passwd'],function(err,result){
            if(err){
                return err;
            }
            else{
                valid=result;
            }
        });
        val['valid']=valid;
        return val;
    });
},
prin : function(){
  console.log("hello ");  
},*/
    login : function(userid,pass,usercall){
        var client = db.dbconnect('history');
        var valout={};
        var login_sql = db.sql('login');
        var query = client.query(login_sql,[userid,pass]);
        query.on('row', function(val) {
            val['valid']=true;
            valout = val;
        });
        query.on('end',function(val) {
            client.end();
            usercall(valout);
        });
    }
    ,
    get_staff_DB : function(staff_id,usercall){
        var client = db.dbconnect('history');
        var sql_get_DB = db.sql('classadv_DB');
        var query = client.query(sql_get_DB,[staff_id]);
        var data;
        query.on('row',function(val) {
            data = val['DB'];
        });
        query.on('end',function(val) {
            usercall(data);
        });
    }
    ,
    get_stud_list : function(user,dbval,data,usercall){
        
                var client = db.dbconnect(dbval);
                var sql_stu;
                var query;
                if(data.type=='classAdv'){
                    sql_stu = db.sql('class_adv_stu');
                    query = client.query(sql_stu,[data.id]);
                }
                else if(data.type=='facultyAdv'){
                    sql_stu = db.sql('class_adv_stu');
                    query = client.query(sql_stu,[data.id]);
                }
                else if(data.type=='subTeach'){
                    sql_stu = db.sql('class_adv_stu');
                    query = client.query(sql_stu,[data.id,data.sub_code]);
                }
                else{
                    
                }
                var data = [];
                query.on('row',function(val) {
                    data.push(val);
                });
                query.on('end',function(val) {
                   usercall(data);
                });
    }
    ,
    getDept : function(user,dbval,usercall){
        if(user){
            var client = db.dbconnect(dbval);
            var dept_query=db.sql('dept');
            var query = client.query(dept_query);
            var dept = [];
            query.on('row',function(val) {
                dept.push(val); 
            });
            query.on('end',function(val){
                usercall(null,dept);
            });
        }
    }
    ,
    getCurBatch : function(admin,dbval,str,usercall){
        if(admin){
            var client = db.dbconnect(dbval);
            var batch_query = db.sql('cur_batch');
            var query = client.query(batch_query);
            var k = [];
            query.on('row',function(val){
                k.push(val);
            });
            query.on('end',function(val){
                client.end();
                usercall(null,k);
            });
        }
    }
    ,
    getBatch : function(admin,dbval,str,usercall){
        if(admin){
            var client = db.dbconnect(dbval);
            var batch_query = db.sql('search_batch');
            var query = client.query(batch_query,['%'+str+'%']);
            var k = [];
            query.on('row',function(val){
                k.push(val);
            });
            query.on('end',function(val){
                client.end();
                usercall(null,k);
            });
        }
    }
    ,
    searchBatch : function(admin,dbval,str,usercall){
        if(admin){
            var client = db.dbconnect(dbval);
            var search_query = db.sql('search_batch');
            var query = client.query(search_query,['%'+str+'%']);
            var k = [];
            query.on('row',function(val) {
                console.dir(val);
                if(val["old_batch"]==true){
                    val["old_batch"]=false;
                }
                else{
                    val["old_batch"]=true;
                }
               k.push(val);
               console.dir(val);
            });
            query.on('end',function(val) {
               client.end();
               usercall(k);
            });
            
        }
    }
    ,
    editBatch : function(admin,dbval,data,usercall){
        if(admin){
            var client = db.dbconnect(dbval);
            var search_query = db.sql('edit_batch');
            var result = {};
            var cur;
            if(data.old_batch){
                cur = 'FALSE';
            }
            else{
                cur = "TRUE";
            }
            console.dir(data.old_batch,cur);
            var query = client.query(search_query,[cur,data.sem,data.batch],function(er) {
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                    console.dir(result);
                }
                else{
                    result["success"]=true;
                }
                usercall(result)
                client.end();
            });
            
        }
    }
    ,
    addBatch : function(admin,dbval,usercall){
        if(admin){
            var client = db.dbconnect('history');
            var DB_query = db.sql('create_db');
            var result = {};
            console.dir(DB_query);
            client.query('CREATE DATABASE \"'+dbval+'\"',function(er) {
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                    console.dir(result);
                    usercall(result)
                }
                else{
                    client.query(DB_query,[dbval,'',''],function(er){
                    if(er){
                        result["success"]=false;
                        result["error_text"]=er.toString();
                        console.dir(result);
                        usercall(result)
                    }
                    else{
                        var newClient = db.dbconnect(dbval);
                        var table = db.sql('create_table');
                        newClient.query(table,function(er){
                            if(er){
                                result["success"]=false;
                                result["error_text"]=er.toString();
                                console.dir(result);
                            }
                            else{
                                result["success"]=true;
                            }
                            usercall(result)
                            client.end();
                            newClient.end();
                        });
                    }
            });
            }
                
            });
            
        }
    }
    ,
    dropBatch : function(admin,dbval,usercall){
        var client = db.dbconnect('history');
        var DB_query = db.sql('drop_db');
        var str = 'DROP DATABASE '+'\"'+dbval+'\";';
        var result = {};
        client.query(DB_query,[dbval],function(er) {
            if(er){
                result["success"]=false;
                result["error_text"]=er.toString();
                console.dir(result);
                usercall(result)
            }
            else{
                client.query(str,function(er) {
                    if(er){
                        result["success"]=false;
                        result["error_text"]=er.toString();
                        console.dir(result);
                    }
                    else{
                        result["success"]=true;
                    }
                    usercall(result);
                    client.end();
                });
            }
        });
    }
    ,
    backup : function(admin,dbval,path,usercall){
        var client = db.dbconnect(dbval);
        console.dir(dbval);
        var k = [];
        var fr=true;
        var quey = client.query(db.sql('show_tables'));
        quey.on('row',function(val){
            if(val["table_name"]!="STUDENT")
            k.push(val["table_name"]);
        });
        quey.on('end',function(val){
            sync.fiber(function(){
                        for(var i=0;i<k.length;i++){
                            console.dir(k[i]);
                        fr = fr && sync.await(module.exports.csvparallel(client,k[i],path,sync.defer()));
                        console.dir(fr);
                        }
                    console.dir(fr)
                    usercall(fr)
            })
        })
    }
    ,
    csvparallel : function(client,k,path,cb){
        var str1 = 'COPY \"'+k+'\" TO \''+path+k+'.csv\' DELIMITER \',\' CSV HEADER;';
        var value = false;
        
        client.query(str1,function(er) { 
            if(er){
                console.log(er.toString());
            }
            else{
                console.log(str1);
                value=true;
            }
            cb(null,value);
        })
    }
    ,
    searchBothUser : function(admin,dbval,search_string,type,from,data,usercall){
            var client = db.dbconnect(dbval);
            var search_query = db.sql('search_both');
            var searchkey = '%'+search_string+'%';
            var query;
            if(data.dept=='all')
            {
                data.dept=null;
            }
            if(type=="student"){
                query = client.query(search_query,[searchkey,searchkey,'','',from,from+20]);
            }
            else if(type=="teacher"){
                query = client.query(search_query,['','',searchkey,searchkey,from,from+20]);
            }
            else{
                query = client.query(search_query,[searchkey,searchkey,searchkey,searchkey,from,from+20]);
            } 
            var k = [];
            query.on('row',function(val) {
                if(data.dept){
                    if(val["DEPARTMENT"]==data.dept){
                        k.push({"id":val["FACULTY_ID"],"name":val["FACULTY_NAME"],"batch":val["Batch"],"type":"teacher"})
                    }
                }
                else{
                    
                    if(val["RRN"])  k.push({"id":val["RRN"],"name":val["STUDENT_NAME"],"batch":val["Batch"],"type":"student","dept":val["dept"],"section":val["SECTION"]});
                    else
                    {
                        console.dir({"id":val["FACULTY_ID"],"name":val["FACULTY_NAME"],"batch":val["Batch"],"type":"teacher"});
                        k.push({"id":val["FACULTY_ID"],"name":val["FACULTY_NAME"],"batch":val["Batch"],"type":"teacher"});
                    }
            
                }
            });
            query.on('end',function(val) {
               client.end();
               usercall(null,k)
            });
    }
    ,
    addStudent : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var search_query = db.sql('add_student');
            client.query(search_query,[data.id,data.name,data.batch,data.passwd,1,data.dept,data.section],function(er) {
                if(er){
                    var result = {};
                    result["success"]=false;
                    result["error_text"]=er.toString();
                    usercall(result);
                }
                else{
                    var result={"success":true};
                    client.end();
                    usercall(result);
                }
                
            });
            
    }
    ,
    addTeacher : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var search_query = db.sql('add_teacher');
            client.query(search_query,[data.id,data.name,data.dept,2,'staff'],function(er) {
                if(er){
                    var result = {};
                    result["success"]=false;
                    result["error_text"]=er.toString();
                    usercall(result);
                }
                else{
                    client.end();
                    var result={"success":true};
                    usercall(result);
                }
                
            });
            
    }
    ,
    editStudent : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var edit_query = db.sql('edit_student');
            client.query(edit_query,[data.name,data.batch,data.id,data.dept,data.section],function(er) {
                
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(result);
            });
            
    }
    ,
    editTeacher : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var edit_query = db.sql('edit_teacher');
            client.query(edit_query,[data.name,data.id,data.dept],function(er) {
                
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(result);
            });
            
    }
    ,
    deleteStudent : function(admin,dbval,id,usercall){
            var client = db.dbconnect(dbval);
            var delete_query = db.sql('delete_student');
            client.query(delete_query,[id],function(er) {
                
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(result);
            });
            
    }
    ,
    deleteTeacher : function(admin,dbval,id,usercall){
            var client = db.dbconnect(dbval);
            var delete_query = db.sql('delete_teacher');
            client.query(delete_query,[id],function(er) {
                
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(result);
            });
            
    }
    ,
    searchSubject : function(admin,dbval,search_string,from,usercall){
            var client = db.dbconnect(dbval);
            var search_sub = db.sql('search_subject');
            var query = client.query(search_sub,['%'+''+search_string+'%',from,from+20]);
            var result = [];
            query.on('row',function(val) {
                result.push(val);
            });
            query.on('end',function(val) {
                client.end();
                usercall(result);
            });
            
    }
    ,
    addSubject : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var add_sub = db.sql('add_subject');
            client.query(add_sub,[data.sub_code,data.sub_name,data.sub_credits],function(er) {
               var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                usercall(result);
            });
            
    }
    ,
    deleteSubject : function(admin,dbval,id,usercall){
            var client = db.dbconnect(dbval);
            var del_sub = db.sql('delete_subject');
            client.query(del_sub,[id],function(er) {
               var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                usercall(result);
            });
            
    }
    ,
    editSubject : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var edit_sub = db.sql('edit_subject');
            console.dir(data);
            console.dir(edit_sub);
            client.query(edit_sub,[data.sub_code,data.sub_name,data.sub_credits],function(er) {
                console.dir(data);
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                usercall(result);
            });
            
    }
    ,
    resetPasswd : function(admin,dbval,id,usercall){
            var client = db.dbconnect(dbval);
            var passwd_query = db.sql('resetPasswd');
            client.query(passwd_query,[''+id,''+id],function(er) {
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(result);
            });
    }
    ,
    getAssigned : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var assigncheck;
            var result=[];
            var query;
            if(data.type=="class_advisor"){
                assigncheck = db.sql('assign_class_check');
                query = client.query(assigncheck,[data.dept,data.section,data.batch,data.staff]);
            }
            else{
                assigncheck = db.sql('assign_fac_check');
                query = client.query(assigncheck,[data.dept,data.section,data.batch,data.stud,data.staff]);
            }
            query.on('row',function(val){
                console.dir(val)
                result.push(val);
            });
            query.on('end',function(val) {
                client.end();
                usercall(null,result);
            })
            
    }
    ,
    assignClassadv : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var result=[];
            var assignclassadv = db.sql('assign_classadv');
            var query = client.query(assignclassadv,[data.staff,data.batch,data.dept,data.section],function(er){
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(null,result);
            });
            
    }
    ,
    assignFacadv : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var result=[];
            var assignfacadv = db.sql('assign_facadv');
            var query = client.query(assignfacadv,[data.batch,data.staff,data.dept,data.section,data.stud],function(er){
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(null,result);
            });
            
    }
    ,
    getStudent : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result=[];
        var stud = db.sql('display_student');
        var query = client.query(stud,[data.dept,data.section,data.batch]);
        query.on('row',function(val){
            result.push(val["RRN"]);
        });
        query.on('end',function(val) {
            var response = {};
            response["stud"]=result;
            response["success"]=true;
            client.end();
            usercall(null,response);
        })
    }
    ,
    showClassadv : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result=[];
        var show = db.sql('show_classadv');
        var query = client.query(show,[data.id]);
        query.on('row',function(val){
            result.push({"id":data.id,"role":"classAdv","batch":val["Batch"],"department":val["DEPARTMENT"],"section":val["SECTION"],"students":val["count"]});
        });
        query.on('end',function(val) {
            client.end();
            usercall(null,[].concat(result));
        })
    }
    ,
    showFacadv : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result=[];
        var show = db.sql('show_facadv');
        var query = client.query(show,[data.id]);
        query.on('row',function(val){
            result.push({"id":data.id,"role":"facultyAdv","batch":val["Batch"],"department":val["DEPARTMENT"],"section":val["SECTION"],"students":val["count"]});
        });
        query.on('end',function(val) {
            client.end();
            usercall(null,[].concat(result));
        })
    }
    ,
    showSubjectTeach : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result=[];
        var show = db.sql('show_subject_teach');
        var query = client.query(show,[data.id]);
        query.on('row',function(val){
            result.push({"id":data.id,"role":"subTeach","batch":val["Batch"],"department":val["DEPARTMENT"],"section":val["SECTION"],"students":val["count"],"sub_code":val["SUBJECT_CODE"]});
        });
        query.on('end',function(val) {
            client.end();
            usercall(null,[].concat(result));
        })
    }
    ,
    setSubjectHistory : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result={};
        var setteach = db.sql('set_subject_history');
        client.query(setteach,[data.staff,data.sub_code,data.batch,data.dept,data.section,data.sem],function(err) {
            if(err){
                result["success"]="false";
                result["error_text"]=err.toString();
            }
            else{
                result["success"]="true";
            }
            client.end();
            usercall(result);
        })
    }
    ,
    setSubjectBatch : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var show = db.sql('set_subject_batch');
        function queryExec(client,q,stud,data,cb){
            var flag;
            client.query(q,[stud,data.sub_code,data.staff],function(err) {
                console.dir(data,stud);
                if(err){
                    console.dir(err);
                    flag=false;
                }
                else{
                    flag=true;
                }
            })
            cb(null,flag);
        }
        sync.fiber(function(){
            var lis = [];
                for(var i=0;i<data.stud.length;i++){
                    lis.push(sync.await(queryExec(client,show,data.stud[i],data,sync.defer())));
                }
                console.dir(lis)
                usercall(lis);
        })
    }
    ,
    deassignClassadv : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var result=[];
            var assignfacadv = db.sql('deassign_classadv');
            var query = client.query(assignfacadv,[data.id],function(er){
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(null,result);
            });
            
    }
    ,
    deassignFacadv : function(admin,dbval,data,usercall){
            var client = db.dbconnect(dbval);
            var assignfacadv = db.sql('deassign_facadv');
            var query = client.query(assignfacadv,[data.id],function(er){
                var result = {};
                if(er){
                    result["success"]=false;
                    result["error_text"]=er.toString();
                }
                else{
                    result={"success":true};
                }
                client.end();
                usercall(null,result);
            });
            
    }
    ,
    deassignSubjectHistory : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result={};
        var deteach = db.sql('deassign_subj_hist');
        client.query(deteach,[data.id,data.sub_code,data.batch,data.dept,data.section],function(err) {
            if(err){
                result["success"]="false";
                result["error_text"]=err.toString();
            }
            else{
                result["success"]="true";
            }
            client.end();
            usercall(result);
        })
    }
    ,
    deassignSubjectBatch : function(admin,dbval,data,usercall){
        var client = db.dbconnect(dbval);
        var result={};
        var deteach = db.sql('deassign_subj_batch');
        client.query(deteach,[data.id,data.sub_code,data.dept,data.section],function(err) {
            if(err){
                result["success"]="false";
                result["error_text"]=err.toString();
            }
            else{
                result["success"]="true";
            }
            client.end();
            usercall(result);
        })
    }
    
};