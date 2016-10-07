var fs = require("fs");
var exec = require('child_process').exec;
/*
function puts(error, stdout, stderr) { 
    sys.puts(stdout)
    var file = __dirname+'/../public/dumb/'+h+'.sql';
    cb(file);
}
exec("PGPASSWORD='enter' pg_dump -U ramki -h localhost "+h+" -f "+__dirname+"/../public/dumb/"+h+".sql", puts);
  */
  
//to execute the give command in shell and return the result

module.exports.write = function(name,data,cb){
    //fs.writeFileSync(__dirname+"/../public/csv/input.csv",data);
    function puts(error, stdout, stderr) { 
        console.log(stdout);
        //var file = __dirname+'/../public/dumb/'+h+'.sql';
        cb(stdout);
    }
    exec(data.toString(), puts);
};

// function to write data to csv file to the specific folder 

module.exports.writecsv = function(name,data,cb){
    fs.writeFileSync(__dirname+"/../public/csv/"+name,data)
    cb(true);
};

