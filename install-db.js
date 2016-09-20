var db = require('./routes/postgresql');
console.log('configuring History DataBase ... ');
db.init(function(result){
        if(result){
            console.dir(result);
            console.log('ERROR in DATABASE Installation failed!!!');
            process.exit();
        }
        else{
            console.log('Successfuuly configured Database!!!');
            process.exit();
        }
        
    });
    