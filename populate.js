var db = require('./routes/postgresql');
console.log('Populating History DataBase ... '+process.argv[2]);
if (process.argv[2]){
    db.populate(process.argv[2],function(result){
        if(!result){
            console.dir(result);
            console.log('ERROR in DATABASE Installation failed!!!');
            process.exit();
        }
        else{
            console.log('Successfuuly populated Database!!!');
            process.exit();
        }
        
    });
}

    