var fs = require("fs");

var pg = require("pg");

// loading sql query as string.
var init = fs.readFileSync('./query/init/init.sql').toString();

var student_cat = fs.readFileSync('./query/join_query.sql').toString();

var gpa_sql = fs.readFileSync('./query/gpa_query.sql').toString();

var sem_credits = fs.readFileSync('./query/credit.sql').toString();

var login = fs.readFileSync('./query/login.sql').toString();

var sem_credits_all = fs.readFileSync('./query/credit_all.sql').toString();

var cgpa_sql = fs.readFileSync('./query/cgpa.sql').toString();

var class_adv_stu = fs.readFileSync('./query/classadv_stu.sql').toString();

var fac_adv_stu = fs.readFileSync('./query/faculty_stud.sql').toString();

var subj_tech_stu = fs.readFileSync('./query/sub_stud.sql').toString();

var fossgraph = fs.readFileSync('./query/foss.sql').toString();

var all_batch = fs.readFileSync('./query/all_batch.sql').toString();

var batch = fs.readFileSync('./query/batch.sql').toString();

var dept = fs.readFileSync('./query/dept.sql').toString();

var search_batch = fs.readFileSync('./query/search_query.sql').toString();

var createDB = fs.readFileSync('./query/ddl/db.sql').toString();

var createTable = fs.readFileSync('./query/ddl/tables.sql').toString();

var drop = fs.readFileSync('./query/ddl/drop.sql').toString();

var edit_batch = fs.readFileSync('./query/ddl/edit_batch.sql').toString();

var backup = fs.readFileSync('./query/backup.sql').toString();

var show_tables = fs.readFileSync('./query/show_tables.sql').toString();

var search_both = fs.readFileSync('./query/search_both.sql').toString();

var add_student = fs.readFileSync('./query/add_student.sql').toString();

var add_teacher = fs.readFileSync('./query/add_teacher.sql').toString();

var edit_student = fs.readFileSync('./query/edit_student.sql').toString();

var edit_teacher = fs.readFileSync('./query/edit_teacher.sql').toString();

var delete_student = fs.readFileSync('./query/delete_student.sql').toString();

var delete_teacher = fs.readFileSync('./query/delete_teacher.sql').toString();

var search_subject = fs.readFileSync('./query/search_subject.sql').toString();

var add_subject = fs.readFileSync('./query/add_subject.sql').toString();

var delete_subject = fs.readFileSync('./query/delete_subject.sql').toString();

var edit_subject = fs.readFileSync('./query/edit_subject.sql').toString();

var assign_class_check = fs.readFileSync('./query/assign/classadv_check.sql').toString();

var assign_fac_check = fs.readFileSync('./query/assign/facadv_check.sql').toString();

var assign_classadv = fs.readFileSync('./query/assign/assign_new_classadv.sql').toString();

var assign_facadv = fs.readFileSync('./query/assign/assign_new_facadv.sql').toString();

var display_student = fs.readFileSync('./query/assign/display_stud.sql').toString();

var classadv_DB = fs.readFileSync('./query/classadv_DB.sql').toString();

var resetPasswd = fs.readFileSync('./query/edit_pass.sql').toString();  

var show_classadv = fs.readFileSync('./query/assign/show_classadv.sql').toString();

var show_facadv = fs.readFileSync('./query/assign/show_facadv.sql').toString();

var show_subj = fs.readFileSync('./query/assign/show_subj.sql').toString();

var setSubjectHistory = fs.readFileSync('./query/assign/assign_subject_history.sql').toString();

var setSubjectBatch = fs.readFileSync('./query/assign/assign_subject_batch.sql').toString();

var deassign_classadv = fs.readFileSync('./query/assign/deassign_classadv.sql').toString();

var deassign_facadv = fs.readFileSync('./query/assign/deassign_facadv.sql').toString();

var deassign_subj_hist = fs.readFileSync('./query/assign/deassign_subj_hist.sql').toString();

var deassign_subj_batch = fs.readFileSync('./query/assign/deassign_subj_batch.sql').toString();

// database connection

function db(db){
    var conString;
    if(db!=''){
        conString = "pg://ramki:enter@localhost:5432/"+db;
    }
    else{
        conString = "pg://ramki:enter@localhost:5432";
    }
    var client = new pg.Client(conString);
    client.connect();
    return client;
}

function sql(opt) {
    
    if(opt === "student_cat"){
        return student_cat;
    }
    else if(opt === "student_gpa"){
        return gpa_sql;
    }
    else if(opt === "student_cgpa"){
        return cgpa_sql;
    }
    else if(opt === "sem_credits"){
        return sem_credits;
    }
    else if(opt === "login"){
        return login;
    }
    else if(opt === "sem_credits_all"){
        return sem_credits_all;
    }
    else if(opt === "class_adv_stu"){
        return class_adv_stu;
    }
    else if(opt === "faculty_adv_stu"){
        return fac_adv_stu;
    }
    else if(opt === "subj_tech_stu"){
        return subj_tech_stu;
    }
    else if(opt === "fossgraph"){
        return fossgraph;
    }
    else if(opt === "batch"){
        return batch;
    }
    else if(opt === "cur_batch"){
        return all_batch;
    }
    else if(opt === "edit_batch"){
        return edit_batch;
    }
    else if(opt === "search_batch"){
        return search_batch;
    }
    else if(opt === "create_table"){
        return createTable;
    }
    else if(opt === "create_db"){
        return createDB;
    }
    else if(opt === "drop_db"){
        return drop;
    }
    else if(opt === "backup"){
        return backup;
    }
    else if(opt === "show_tables"){
        return show_tables;
    }
    else if(opt === "show_tables"){
        return show_tables;
    }
    else if(opt === "search_both"){
        return search_both;
    }
    else if(opt === "add_student"){
        return add_student;
    }
    else if(opt === "add_teacher"){
        return add_teacher;
    }
    else if(opt === "edit_student"){
        return edit_student;
    }
    else if(opt === "edit_teacher"){
        return edit_teacher;
    }
    else if(opt === "delete_student"){
        return delete_student;
    }
    else if(opt === "delete_teacher"){
        return delete_teacher;
    }
    else if(opt === "classadv_DB"){
        return classadv_DB;
    }
    else if(opt === "dept"){
        return dept;
    }
    else if(opt === "search_subject"){
        return search_subject;
    }
    else if(opt === "add_subject"){
        return add_subject;
    }
    else if(opt === "edit_subject"){
        return edit_subject;
    }
    else if(opt === "delete_subject"){
        return delete_subject;
    }
    else if(opt === "assign_class_check"){
        return assign_class_check;
    }
    else if(opt === "assign_fac_check"){
        return assign_fac_check;
    }
    else if(opt === "resetPasswd"){
        return resetPasswd;
    }
    else if(opt === "assign_classadv"){
        return assign_classadv;
    }
    else if(opt === "assign_facadv"){
        return assign_facadv;
    }
    else if(opt === "display_student"){
        return display_student;
    }
    else if(opt === "show_classadv"){
        return show_classadv;
    }
    else if(opt === "show_facadv"){
        return show_facadv;
    }
    else if(opt === "show_subject_teach"){
        return show_subj;
    }
    else if(opt === "set_subject_history"){
        return setSubjectHistory;
    }
    else if(opt === "set_subject_batch"){
        return setSubjectBatch;
    }
    else if(opt === "deassign_classadv"){
        return deassign_classadv;
    }
    else if(opt === "deassign_facadv"){
        return deassign_facadv;
    }
    else if(opt === "deassign_subj_hist"){
        return deassign_subj_hist;
    }
    else if(opt === "deassign_subj_batch"){
        return deassign_subj_batch;
    }
    else if(opt === "init"){
        return init;
    }
    else{
        return "0";
    }
}
module.exports.sql=sql;
module.exports.dbconnect = db;
