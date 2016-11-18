exports.trans=function(db_obj,usercall){
    //returns a JAVA 'Set' like array - which is also sorted
    function sortedSet(arr) {
        var dict = {};
        var set = [];
        for(var i = 0; i < arr.length; i++) {
            dict[arr[i]] = undefined;
        }
        for(var key in dict) {
            set.push(key);    
        }
        return set.sort();
    }
    
    //used to produce object-keys w.r.t subject-code
    function mak(sub_code) {
        return [sub_code, sub_code + "-Att"];
    }
    var db_arr = db_obj.db;
    
    var rrn_arr = db_obj.rrn;
    var sub_arr = [];
    console.dir(rrn_arr)
    
    db_arr.forEach(function(item) {
        //rrn_arr.push(item.rrn);
        sub_arr.push(item.sub_code);
    });
    
    rrn_arr = sortedSet(rrn_arr);
    sub_arr = sortedSet(sub_arr);
    
    //--------------------------------------------
    
    var dod = {};           //dict of dict
    for(var i = 0; i < rrn_arr.length; i++) {
        var dict = {};
        dict['RRN'] = rrn_arr[i];
    
        for(var j = 0; j < sub_arr.length; j++) {
    
            var curSub = mak(sub_arr[j]);
            var mark_k = curSub[0];
            var att_k = curSub[1];
            
            dict[mark_k] = 0;
            dict[att_k] = 0;
        }
        dod[rrn_arr[i]] = dict;
    }
    
    //-----------------------------------------
    
    for(var i = 0; i < db_arr.length; i++) {
        var curStud = db_arr[i].rrn;
    
        var curSub = mak(db_arr[i].sub_code);
        var mark_k = curSub[0];
        var att_k = curSub[1];
    
        dod[curStud][mark_k] = db_arr[i].mark;
        dod[curStud][att_k] = db_arr[i].att;
    }
    
    //-----------------------------------------
    
    var th = [];        //table-header
    for(var i = 0; i < sub_arr.length; i++) {
        var curStud = mak(sub_arr[i]);
        th.push(curStud[0]);
        th.push(curStud[1]);
    }
    
    var lol = [];       //list of list
    for(var i=0; i < rrn_arr.length; i++) {
        var list = [];
        list.push(rrn_arr[i]);
        for(var j=0; j < th.length; j++) {
            list.push(dod[rrn_arr[i]][th[j]]);
        }
        lol.push(list);
    }
    
    //-----------------------------------------
    
    th.unshift("RRN");
    lol.unshift(th);
    usercall(lol);
}