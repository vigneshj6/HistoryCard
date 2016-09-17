var fs = require('fs');
var archiver = require('archiver');
module.exports = {
    zipIt : function(fname,usercall){
        
        var zipper = archiver('zip');
        
        //change here for output-file name - zip name
        var out = fs.createWriteStream(__dirname + "/public/dumb/"+fname+".zip");
        
        
        //change here for input-directory
        zipper.bulk([
            { expand: true, cwd: "public/dumb/sup", src: ["*.csv"] }
        ]);
        
        zipper.pipe(out);
        
        //zipping process will be executed
        zipper.finalize();
        
        //when the writeStream is finished.
        out.on("close", function(){
           console.log("Zip package has been successfully created.."); 
           usercall(true);
        });
        
        //in case any error happens
        zipper.on("error", function(err){
            throw err;
            //usercall(false)
        });
    }
};