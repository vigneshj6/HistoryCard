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
// To execute the give command in shell and return the result

module.exports.shell = function(data,cb){
    //fs.writeFileSync(__dirname+"/../public/csv/input.csv",data);
    function puts(error, stdout, stderr) { 
        console.log(stdout);
        //var file = __dirname+'/../public/dumb/'+h+'.sql';
        cb(stdout);
    }
    exec(data.toString(), puts);
};

// function to write data to csv file to the specific folder 

module.exports.writecsv = function(fileName,data,cb){
    fs.writeFileSync(__dirname+"/../public/csv/"+fileName,data);
    cb(true);
};
module.exports.transform = function(cb){
    module.exports.shell("python3 CSV_Handling/catHandler.py cat1 markAtt 1 public/csv/input.csv public/csv/out.csv",function(val){
        console.dir(val);
        cb();
    });
};


