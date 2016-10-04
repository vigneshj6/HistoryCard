var fs = require("fs");

var pg = require("pg");

var config = require('../config.json');

// loading sql query as string.
var init = fs.readFileSync('./query/init/init.sql').toString();

var login = fs.readFileSync('./query/login.sql').toString();

//----------------------------- Admin/Assign ----------------------------------------------


var assign_classadv = fs.readFileSync('./query/admin/assign/assign_new_classadv.sql').toString();

var assign_facadv = fs.readFileSync('./query/admin/assign/assign_new_facadv.sql').toString();

var setSubjectHistory = fs.readFileSync('./query/admin/assign/assign_subject_history.sql').toString();

var setSubjectBatch = fs.readFileSync('./query/admin/assign/assign_subject_batch.sql').toString();

var assign_class_check = fs.readFileSync('./query/admin/assign/classadv_check.sql').toString();

var deassign_classadv = fs.readFileSync('./query/admin/assign/deassign_classadv.sql').toString();

var deassign_facadv = fs.readFileSync('./query/admin/assign/deassign_facadv.sql').toString();

var deassign_subj_hist = fs.readFileSync('./query/admin/assign/deassign_subj_hist.sql').toString();

var deassign_subj_batch = fs.readFileSync('./query/admin/assign/deassign_subj_batch.sql').toString();

var display_student = fs.readFileSync('./query/admin/assign/display_stud.sql').toString();

var assign_fac_check = fs.readFileSync('./query/admin/assign/facadv_check.sql').toString();

var show_classadv = fs.readFileSync('./query/admin/assign/show_classadv.sql').toString();

var show_facadv = fs.readFileSync('./query/admin/assign/show_facadv.sql').toString();

var show_subj = fs.readFileSync('./query/admin/assign/show_subj.sql').toString();

//------------------------------ Admin/Backup ----------------------------------------------

var createDB = fs.readFileSync('./query/admin/backup/db.sql').toString();

var drop = fs.readFileSync('./query/admin/backup/drop.sql').toString();

var populate = fs.readFileSync('./query/admin/backup/populate.sql').toString();

var show_tables = fs.readFileSync('./query/admin/backup/show_tables.sql').toString();

var createTable = fs.readFileSync('./query/admin/backup/tables.sql').toString();


//------------------------------- Admin/Batch -----------------------------------------------

var batch = fs.readFileSync('./query/admin/batch/batch.sql').toString();

var cur_batch = fs.readFileSync('./query/admin/batch/cur_batch.sql').toString();

var edit_batch = fs.readFileSync('./query/admin/batch/edit_batch.sql').toString();

var search_batch = fs.readFileSync('./query/admin/batch/search_query.sql').toString();

//------------------------------- Admin/dept ------------------------------------------------

var dept = fs.readFileSync('./query/admin/dept/dept.sql').toString();

//------------------------------- Admin/subject ---------------------------------------------

var delete_subject = fs.readFileSync('./query/admin/subject/delete_subject.sql').toString();

var edit_subject = fs.readFileSync('./query/admin/subject/edit_subject.sql').toString();

var add_subject = fs.readFileSync('./query/admin/subject/add_subject.sql').toString();

var search_subject = fs.readFileSync('./query/admin/subject/search_subject.sql').toString();

//-------------------------------- Admin/user  -----------------------------------------------


var add_student = fs.readFileSync('./query/admin/user/add_student.sql').toString();

var add_teacher = fs.readFileSync('./query/admin/user/add_teacher.sql').toString();

var delete_student = fs.readFileSync('./query/admin/user/delete_student.sql').toString();

var delete_teacher = fs.readFileSync('./query/admin/user/delete_teacher.sql').toString();

var edit_student = fs.readFileSync('./query/admin/user/edit_student.sql').toString();

var edit_teacher = fs.readFileSync('./query/admin/user/edit_teacher.sql').toString();

var resetPasswd = fs.readFileSync('./query/admin/user/reset_pass.sql').toString();

var search_both = fs.readFileSync('./query/admin/user/search_both.sql').toString();

//-------------------------------- Student ----------------------------------------------------

var cgpa_sql = fs.readFileSync('./query/student/cgpa.sql').toString();

var sem_credits = fs.readFileSync('./query/student/credit.sql').toString();

var gpa_sql = fs.readFileSync('./query/student/gpa_query.sql').toString();

var student_cat = fs.readFileSync('./query/student/join_query.sql').toString();

var sem_credits_all = fs.readFileSync('./query/student/credit_all.sql').toString();

//--------------------------------- Teacher/Class Advisor -------------------------------------

var classadv_DB = fs.readFileSync('./query/teacher/class_advisor/classadv_DB.sql').toString();

var class_adv_stu = fs.readFileSync('./query/teacher/class_advisor/classadv_stu.sql').toString();

var classadv_cat1 = fs.readFileSync('./query/teacher/class_advisor/classadv_cat1.sql').toString();

//--------------------------------- Teacher/Faculty_Advisor -----------------------------------

var fac_adv_stu = fs.readFileSync('./query/teacher/faculty_advisor/faculty_stud.sql').toString();

//--------------------------------- Teacher/Subject_Teacher -----------------------------------

var subj_tech_stu = fs.readFileSync('./query/teacher/subject_teacher/sub_stud.sql').toString();

// database connection

function db(db){
    var conString;
    if(db!='')
    {
        conString = "pg://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+":5432/"+db;
    }
    else
    {
        conString = "pg://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+":5432/";
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
    else if(opt === "batch"){
        return batch;
    }
    else if(opt === "cur_batch"){
        return cur_batch;
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
    else if(opt === "populate"){
        return populate;
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
    else if(opt === "classadv_cat1"){
        return classadv_cat1;
    }
    else{
        return "0";
    }
}
module.exports.sql=sql;
module.exports.dbconnect = db;
