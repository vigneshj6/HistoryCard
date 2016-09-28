var TEACH = (function(TEACH) {

    var _url = {
        roleList : "/teacher/role-list",
        dashboard : "/teacher/dashboard-html",
        studList : "/teacher/stud-list",
        reportHc : "/teacher/report-hc",
        reportCredits : "/teacher/report-credits",
        reportCgpa : "/teacher/report-cgpa"
    }

    function _ajaxConfig(url, type, data, resType) {
        return {
            url : url,
            type : type,
            data : data,
            cache : false,
            dataType : resType
        }
    }

    function fetchRole(successCb, failCb) {
        var req = $.ajax(_ajaxConfig(_url.roleList, 'GET', null, 'json'));
        req.done(successCb);
        req.fail(failCb);
    }  

    function fetchDashboard(data, successCb, failCb) {
        var req = $.ajax(_ajaxConfig(_url.dashboard, 'GET', data, 'html'));
        req.done(successCb);
        req.fail(failCb);
    }

    function fetchStudList(data, successCb, failCb) { 
        var req = $.ajax(_ajaxConfig(_url.studList, 'GET', data, 'json'));
        req.done(successCb);
        req.fail(failCb);
    }  

    function fetchReportHc(data, successCb, failCb) {
        var req = $.ajax(_ajaxConfig(_url.reportHc, 'GET', data, 'json'));
        req.done(successCb);
        req.fail(failCb);
    }

    function fetchCredits(data, successCb, failCb) {
        var req = $.ajax(_ajaxConfig(_url.reportCredits, 'GET', data, 'json'));
        req.done(successCb);
        req.fail(failCb);
    }

    function fetchCgpa(data, successCb, failCb) {
        var req = $.ajax(_ajaxConfig(_url.reportCgpa, 'GET', data, 'json'));
        req.done(successCb);
        req.fail(failCb);
    }

    TEACH.Fs = {
        fetchRole : fetchRole,
        fetchDashboard : fetchDashboard,
        fetchStudList : fetchStudList,
        fetchReportHc : fetchReportHc,
        fetchCredits : fetchCredits,
        fetchCgpa : fetchCgpa
    }  
    return TEACH;  
}(TEACH || {}));