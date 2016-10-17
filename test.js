//var csv = require("./routes/csvtrans");
var eventemit = require("events").EventEmitter;
var db = require("./routes/postgresql");
console.dir(__dirname);
db.csvtotable("hello","out.csv","CAT1_TEMP_TABLE",__dirname+"/public/csv/",function(val){
    console.dir(val);
});
var r = new eventemit();
    r.on('hi',function(){
    console.log("hi event happened");
    
});
r.emit('hi');
var func = function(){
return new Promise(
function(resolve,reject){
    resolve();
    Promise.all();
})
.then(function(){
    console.log("next");
})
.catch(function(){
    console.log("crash");
});
};

func()
.then(function(){
    console.log("completed");
})
.catch(function(){
    console.log("termi1");
})
.then(function(){
    console.log("terminate");
})
.catch(function(){
    console.log("termi2");
});

