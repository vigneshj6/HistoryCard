//login.js handles login/logout functionality
//postgresql.js have functions that communicate with database
var db=require("./postgresql");


//body-parser package has request parser functionality
//request with query parsed to json eg: (?sem=1 to {sem:1}) 
db.init(function(result){
        if(result){
            console.dir(result);
            process.exit();
        }
        else{
            console.log('Successfuuly configured Database!!!');
            process.exit();
        }
        
    });

//exports the module and functions defined here to main.js(refer main.js).
//we recieve router object and session json from main.js
module.exports = function(routes,session) {
    // post request to /login
    routes.post('/',function(req,res){
        //check for user in post method
        if(req.body.usr){
            //debug cmd
            console.log(req.body.usr+" hi");
            //login function (refer) postgresql.js
            db.login(req.body.usr,req.body.pass,function(result){
                if(result['valid']==true){
                    req.session.user=req.body.usr;
                    req.session.db=result['DB'];
                    console.log(req.session.user+"-logged in");
                    //if type 1 then student (refer postgresql history database)
                    if(result['type']==1){
                        console.log("student"+result['type']);
                        req.session.type="student";//save user type
                        res.redirect('/student');//redirect to /student
                    }
                    else if(result['type']==2){
                        req.session.type="teacher";//save user type
                        res.redirect('/teacher');//redirect to /teacher
                    }
                    else if(result['type']==3){
                        req.session.type="admin";//save user type
                        res.redirect('/admin');//redirect to admin
                    }
                    else{
                        res.redirect("/");//redirect to login page if anything wrong
                    }
                }
                else{
                    res.send("error");//TODO redirect to error page
                }
            });
        }
        else{
            res.send('dont know what happened');
        }
    });
    // /logout or /login with get method redirect to login page
    routes.get('/',function(req,res){
        var usr=req.session.user;
        console.log(usr+"-logged out");//debug
        //TODO logout file
        if(usr){//check for session to destroy it.
            req.session.destroy(function(err) {//destory session variable for user
                if(err) {
                    console.dir(err);
                    res.redirect('/');//redirect to login page
                }
            });
        }
        res.redirect('/');
    });
    
};//end of module