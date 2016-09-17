var db = require('./routes/postgresql');
console.log('configuring History DataBase ... ');
db.init(function(result){
        if(result){
            console.dir(result);
            console.log('ERROR in DATABASE Installation failed!!!');
        }
        else{
            console.log('Successfuuly configured Database!!!');
        }
    });
    