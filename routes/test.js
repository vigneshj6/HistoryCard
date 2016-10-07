var csv = require("./csvtrans")

csv.writecsv('hi.csv','hello',function(val){
    console.dir(val);
})