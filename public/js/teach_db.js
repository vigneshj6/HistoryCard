//---------- TEACH.Role ----------//

var TEACH = (function(TEACH) {

    var _id = null,
        _classAdv = {},
        _facultyAdv = {},
        _subTeach = [];

    function _add(role, obj) {
        if(role === "classAdv") {
            _classAdv.role = 'classAdv';
            _classAdv.batch = obj.batch;
            _classAdv.dept = obj.dept;
            _classAdv.sec = obj.sec;
        }
        else if(role === "facultyAdv") {
            _facultyAdv.role = 'facultyAdv';
            _facultyAdv.batch = obj.batch;
            _facultyAdv.dept = obj.dept;
            _facultyAdv.sec = obj.sec;
        }
        else if(role === "subTeach") {
            var sub = {};
            sub.role = 'subTeach';
            sub.batch = obj.batch;
            sub.dept = obj.dept;
            sub.sec = obj.sec;
            sub.code = obj.sub_code;

            _subTeach.push(sub);
        }
    }

    function addBulk(arr) {
        arr.forEach(function(item) {
            _add(item.role, item);
        });
    }

    function getList() {
        var obj = {};
        if(notEmpty(_classAdv)) {
            obj.classAdv = _classAdv; 
        }
        if(notEmpty(_facultyAdv)) {
            obj.facultyAdv = _facultyAdv; 
        }
        if(notEmpty(_subTeach)) {
            obj.subTeach = _subTeach; 
        }
        return obj;
    }

    function getInfo(role) {
        if(role === 'classAdv' && notEmpty(_classAdv)) {
            return _classAdv;
        }
        else if(role === 'facultyAdv' && notEmpty(_facultyAdv)) {
            return _facultyAdv;
        }
        else {
            for(var i = 0; i < _subTeach.length; i++) {
                if(_subTeach[i].code === role) {
                    return _subTeach[i];
                }
            }
        }
    }

    TEACH.Role = {
        addBulk : addBulk, 
        getList : getList,
        getInfo : getInfo
    }
    return TEACH;

}(TEACH || {}));

//---------- TEACH.Stud ----------//

var TEACH = (function(TEACH) {

    var _studList = [];

    function _add(obj) {
        var stud = {}
        stud.rrn = obj.rrn;
        stud.name = obj.name;
        stud.batch = obj.batch;
        stud.credits = obj.credits || {};
        stud.cgpa = obj.cgpa || undefined;
        _studList.push(stud);
    }

    function addBulk(arr) {
        arr.forEach(function(item) {
            _add(item);
        });
    }
    
    function clear() {
        _studList = [];
    }

    function getInfo(rrn) {
        for(var i = 0; i < _studList.length; i++) {
            if(_studList[i].rrn === rrn) {
                var obj = {
                    rrn : _studList[i].rrn,
                    name : _studList[i].name,
                    batch : _studList[i].batch,
                }
                return obj;
            }
        }
        return undefined;
    }

    function getList() {
        return _studList;
    }

    function getCredits(rrn) {
        for(var i = 0; i < _studList.length; i++) {
            if(_studList[i].rrn === rrn) {
                return _studList[i].credits;
            }
        }
        return undefined;
    }

    function addCredits(rrn, credits) {
        for(var i = 0; i < _studList.length; i++) {
            if(_studList[i].rrn === rrn) {
                _studList[i].credits = credits;
                return true;
            }
        }
        return false;
    }

    function getCgpa(rrn) {
        for(var i = 0; i < _studList.length; i++) {
            if(_studList[i].rrn === rrn) {
                return _studList[i].cgpa;
            }
        }
        return undefined;
    }

    function addCgpa(rrn, cgpa) {
        for(var i = 0; i < _studList.length; i++) {
            if(_studList[i].rrn === rrn) {
                _studList[i].cgpa = cgpa;
                return true;
            }
        }
        return false;
    }

    TEACH.Stud = { 
        addBulk : addBulk,
        clear : clear,
        getInfo : getInfo,
        getList : getList,
        addCredits : addCredits,
        getCredits : getCredits,
        addCgpa : addCgpa,
        getCgpa : getCgpa
    }
    return TEACH;

}(TEACH || {}));


//---------- TEACH.Cache ----------//

var TEACH = (function(TEACH) {

    var _cache = {};

    function put(key, value) {
        _cache[key] = value;
        return true;
    }

    function get(key) {
        return _cache[key];
    }

    TEACH.Cache = { 
        put : put,
        get : get
    }
    return TEACH;

}(TEACH || {}));