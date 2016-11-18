var TEACH = (function(TEACH) {
    var Hb = Handlebars;

    var _Error = {},
        _Field = {
            role : undefined
        },
        _Bind = {},
        Event = {};
        
    var _template = {
        fail : "<div class='alert alert-danger text-center'><span><i class='glyphicon glyphicon-warning-sign'></i>{{first}}<strong>{{middle}}</strong>{{last}}</span></div>",

        info : "<div class='alert alert-warning text-center'><span><i class='glyphicon glyphicon-alert'></i>{{first}}<strong>{{middle}}</strong>{{last}}</span></div>",

        success : "<div class='alert alert-info text-center'><span><i class='glyphicon glyphicon-ok'></i>{{first}}<strong>{{middle}}</strong>{{last}}</span></div>",

        loading : "<div class='alert alert-info text-center'><span><i class='glyphicon glyphicon-hourglass'></i><strong>Loading..</strong></span></div>",

        roleList : "{{#if classAdv}}<li onclick='changeRole(\"classAdv\")'><a href='#'><b>Class Advisor</b><code>{{classAdv.batch}} | {{classAdv.dept}} | {{classAdv.sec}}</code></a></li>{{/if}}{{#if facultyAdv}}<li onclick='changeRole(\"facultyAdv\")'><a href='#'><b>Faculty Advisor</b><code>{{facultyAdv.batch}} | {{facultyAdv.dept}} | {{facultyAdv.sec}}</code></a></li>{{/if}}{{#each subTeach}}<li onclick='changeRole(\"{{code}}\")'><a href='#'><b>{{code}}</b><code>{{batch}} | {{dept}} | {{sec}}</code></a></li>{{/each}}",

        studList : "{{#each stud}}<option value='{{rrn}}'>{{rrn}} : {{name}}</option>{{/each}}",

        reportHc : "{{#each report_hc}}<tr><td data-toggle='tooltip' title='<p class=\"text-left margin-tb\"><b>Subject Name : </b> {{sub_name}}<br><b>Credits : </b> {{credits}}</p>' data-placement='auto right'data-container='#reportHc' data-html='true'>{{sub_code}}</td><td>{{cat1_mark}}</td><td>{{cat1_att}}</td><td>{{cat2_mark}}</td><td>{{cat2_att}}</td><td>{{cat3_mark}}</td><td>{{cat3_att}}</td><td>{{int_mark}}</td><td>{{cumm_att}}</td><td>{{grade}}</td><td>{{arrear}}</td><td>{{redo}}</td></tr>{{/each}}<tr><th colspan='12' class='text-right'>GPA: {{gpa}}&emsp;&emsp;</th></tr>",

        reportCredits : "{{#each credits}}<b>Sem - {{sem}} : </b>{{credits}}<br/>{{/each}}-----------<br/><b>Total : </b>{{tot_credits}}<br/>",

        reportCgpa : "<b>CGPA : </b>{{cgpa}}<br/>",

        loadingPopover : "<span class='glyphicon glyphicon-repeat glyphicon-spin'></span> Loading..",

        failPopover : "<b>Failed to fetch data. </b>Try again..!",

        popoverTitle : ".<a href='#' class='close' data-dismiss='alert'>&times;</a>",

        markAttTableControl : "<button type='button' class='btn btn-primary btn-mg pull-right' data-loading-text='please wait..' id='saveMarkAttBtn'>Save</button><button type='button' class='btn btn-danger btn-mg pull-right margin-lr' id='cancelMarkAttBtn'>Cancel</button>"
    }
    
    function _hb2html(template, json_obj) {
        return Hb.compile(template)(json_obj);
    }

    function _pasteHtml(id, template, obj) {
        if(typeof(obj) !== 'undefined') {
            var data = _hb2html(template, obj);    
        }
        else {
            var data = template;
        }
        $('#' + id).html(data);
    }

    function _toastHtml(id, template, obj, time) {
        _pasteHtml(id, template, obj);
        setTimeout(function() {
            $('#' + id).empty();
        }, time);
    }

    function init() {
        TEACH.Fs.fetchRole(_updateRoleList, _Error.roleFetch);
    }

    function _updateRoleList(res) {
        TEACH.Role.addBulk(res.assignments);

        var roleObj = TEACH.Role.getList();
        _pasteHtml('roleList', _template.roleList, roleObj);

        var msg = {
            first : " Please select a 'role' from the navigation-bar"
        }
        _pasteHtml('headerInfo', _template.info, msg);
    }

    function _updateDashboard(roleObj) {
        var data = {
            role : roleObj.role
        }
        TEACH.Fs.fetchDashboard(data, 
            function(html) {
                _pasteHtml('dashboard', html);

                var msg = {
                    first : " UI has been successfully loaded!"
                }
                _toastHtml('headerInfo', _template.success, msg, 3500);
        
                _updateStudList();
                _Bind.dashboard(roleObj.role);
            },
            function() {
                _Error.dashFetch();
            });
    }

    function _updateStudList() {
        var roleObj = TEACH.Role.getInfo(_Field.role);

        TEACH.Fs.fetchStudList(roleObj,
            function(res) {
                TEACH.Stud.addBulk(res.stud);
                _pasteHtml('studList', _template.studList, res);

            },
            function() {
                _Error.studFetch();
            });
    }

    function _updateSemReport() {
        
        if(_Field.validateSem() === false) {
            _Error.invalidSem();
            $('#semesterInp').val('');    
            return false;
        }
        else {
            $('#loadReportBtn').button('loading');
            var rrn = _Field.student();
            var data = {
                sem : _Field.semester(),
                rrn : rrn,
                batch : TEACH.Stud.getInfo(rrn).batch, 
            }

            TEACH.Fs.fetchReportHc(data,
                function(res) {
                    _pasteHtml('reportHc', _template.reportHc, res);
                    $("[data-toggle='tooltip']").tooltip();
                    $('#loadReportBtn').button('reset');
                },
                function() {
                    _Error.reportFetch();
                    $('#loadReportBtn').button('reset');
                });
        }
    }

    function _prevSemReport() {
        var prevSem = _Field.semester() - 1;
        $('#semesterInp').val(prevSem);
        _updateSemReport();
    }

    function _nextSemReport() {
        var nextSem = _Field.semester() + 1;
        $('#semesterInp').val(nextSem);
        _updateSemReport();
    }

    function _updateCredits() {
        $('#creditsBtn').popover('show');
        var rrn = _Field.student();
        var credits = TEACH.Stud.getCredits(rrn); 
        if(empty(credits)) {
            var studInfo = TEACH.Stud.getInfo(rrn);
            var data = {
                rrn : studInfo.rrn,
                batch : studInfo.batch
            }

            TEACH.Fs.fetchCredits(data,
                function(res) {
                    TEACH.Stud.addCredits(rrn, res);
                    var html = _hb2html(_template.reportCredits, res);
                    $('#creditsBtn').attr('data-content', html);
                    $('#creditsBtn').popover('show');
                },
                function() {
                    _Error.creditsFetch();
                });
        }
        else {
            var html = _hb2html(_template.reportCredits, credits);
            $('#creditsBtn').attr('data-content', html);
            $('#creditsBtn').popover('show');
        }
    }
    
    function _updateCgpa() {
        $('#cgpaBtn').popover('show');
        var rrn = _Field.student();
        var cgpa = TEACH.Stud.getCgpa(rrn);
        if(cgpa === undefined) {
            var studInfo = TEACH.Stud.getInfo(rrn);
            var data = {
                rrn : studInfo.rrn,
                batch : studInfo.batch
            }

            TEACH.Fs.fetchCgpa(data,
                function(res) {
                    TEACH.Stud.addCgpa(rrn, res.cgpa);
                    var html = _hb2html(_template.reportCgpa, res);
                    $('#cgpaBtn').attr('data-content', html);
                    $('#cgpaBtn').popover('show');
                },
                function() {
                    _Error.cgpaFetch();
                });
        }
        else {
            var data = {
                cgpa : cgpa
            }
            var html = _hb2html(_template.reportCgpa, data);
            $('#cgpaBtn').attr('data-content', html);
            $('#cgpaBtn').popover('show');
        }
    }

    function _genMarkAttTable(arrOfArr) {    
        var header = arrOfArr[0];
        var thead_html = '<thead><tr>';
        for(var i = 0; i < header.length; i++) {
            thead_html += '<th>' + header[i] + '</th>';
        }
        thead_html += '</tr></thead>';

        var tbody_html = '<tbody>';
        for(var i = 1; i < arrOfArr.length; i++) {
            var tr_html = '<tr>';
            var row = arrOfArr[i];
            tr_html += '<th>' + row[0] + '</th>';
            for(var j = 1; j < row.length; j++) {
                tr_html += '<td tabindex="1">' + row[j] + '</td>';
            }
            tr_html += '</tr>';
            tbody_html += tr_html;
        }
        tbody_html += '</tbody>';

        return thead_html + tbody_html;
    }
    function _table2csv(id) {
        var csv = "";
        $('#' + id + ' tr').each(function() {
            var $row = $(this); 
            var arr = [];
            $row.children().each(function() {
                var $cell = $(this);
                arr.push($cell.text()); 
            });
            csv += arr.toString() + "\n";
        });
        return csv;
    }
    function _table2arr(id) {
        var arrOfArr = [];
        $('#' + id + ' tr').each(function() {
            var $row = $(this); 
            var arr = [];
            $row.children().each(function() {
                var $cell = $(this);
                arr.push($cell.text());
            });
            arrOfArr.push(arr);
        });
        return arrOfArr;
    }

    function _updateMarkAttTable() {
        var roleObj = TEACH.Role.getInfo(_Field.role);
        
        var data = {
            role : roleObj.role,
            sem: roleObj.sem,
            sub_code : roleObj.code || undefined,
            table_type : _Field.markAttType()
        }
        
        _pasteHtml('headerInfo', _template.loading);
        TEACH.Fs.fetchMarkAtt(data,
            function(res) {
                TEACH.Cache.put('markAttTable', res.table_data);
                var table_html = _genMarkAttTable(res.table_data);
                _pasteHtml('markAttTable', table_html);
                
                var msg = {
                    first : " Table data has been loaded successfully."
                }
                _toastHtml('headerInfo', _template.success, msg, 3500);
            },
            function() {
                _Error.markAttFetch();
            });
    }
    
    function _restoreMarkAttTable() {
        var table_data = TEACH.Cache.get('markAttTable');
        var table_html = _genMarkAttTable(table_data);
        _pasteHtml('markAttTable', table_html);
        $('#markAttTable').off();
        $('#editMarkAttBtn').prop('disabled', false);
        $('#markAttFooter').empty();
        var msg = {
            first : " Your changes have been canccelled."
        }
        _toastHtml('markAttFooter', _template.info, msg, 3500);
    }

    function _submitMarkAttTable() {
        $('#saveMarkAttBtn').button('loading');
        var roleObj = TEACH.Role.getInfo(_Field.role);
        var csv = _table2csv('markAttTable');
        
        var data = {
            role : roleObj.role,
            sem: roleObj.sem,
            sub_code : roleObj.code || undefined,
            table_type : _Field.markAttType(),
            table_data : csv
        }
        
        TEACH.Fs.submitMarkAtt(data,
            function(res) {
                if(res.success === true) {
                    TEACH.Cache.put('markAttTable', csv);
                    $('#markAttFooter').empty();
                    $('#markAttTable').off();
                    $('#editMarkAttBtn').prop('disabled', false);
                    var msg = {
                        middle : " Success.",
                        last : " Your changes have been saved"
                    }
                    _toastHtml('markAttFooter', _template.success, msg, 3500);
                }
                else {
                    $('#saveMarkAttBtn').button('reset');
                    
                    var msg = {
                        middle : " Error: ",
                        last : res.error
                    }
                    
                    _toastHtml('markAttFooter', _template.info, msg, 3500);
                }
            },
            function() {
                $('#saveMarkAttBtn').button('reset');
                _Error.markAttSubmit();
            });
    }

    //---------- Ui.Event ----------//

    Event.changeRole = function(role) {
        _Field.role = role;
        var roleObj = TEACH.Role.getInfo(_Field.role);
        if(roleObj) {
            _updateDashboard(roleObj);    
        }
        else {
            var msg = {
                first : " Something went wrong! ",
                middle : "Try again or 'Refresh' this page."
            }
            _toastHtml('headerInfo', _template.fail, msg, 3500);
        }
    }

    Event.changeStud = function() {
        var html = _template.loadingPopover;
        $('#cgpaBtn').attr('data-content', html);
        $('#creditsBtn').attr('data-content', html);
    }

    Event.changeMarkAttType = function() {
        $('#editMarkAttBtn').prop('disabled', false);
        $('#markAttFooter').empty();
        _updateMarkAttTable();
    }

    Event.editMarkAttTable = function() {
        $('#markAttTable').editableTableWidget();
        $('#editMarkAttBtn').prop('disabled', true);
        _pasteHtml('markAttFooter', _template.markAttTableControl);
        _Bind.markAttControl();
    }

    //---------- Ui._Bind ----------//

    _Bind.dashboard = function(role) {
        if(role === 'facultyAdv') {
            $('#semesterInp').keypress(function(e) {
                if(e.which === 13) {
                    _updateSemReport();
                    return false;
                }
            });

            $('#studList').change(Event.changeStud);
            
            $('#loadReportBtn').click(_updateSemReport);
            $('#prevReportBtn').click(_prevSemReport);
            $('#nextReportBtn').click(_nextSemReport);
            $('#creditsBtn').click(_updateCredits);
            $('#cgpaBtn').click(_updateCgpa);

            $('[data-toggle=popover]').popover({
                placement : 'auto top',
                html : true,
                title : _template.popoverTitle,
                trigger : 'manual'
            });
            $(document).on('click', '.popover .close', function() {
                $(this).parents('.popover').popover('hide');
            });
        }
        else if(role === 'classAdv') {
            $('input[name=markAttType]').each(function() {
                $(this).change(Event.changeMarkAttType);
            });
            $('#editMarkAttBtn').click(Event.editMarkAttTable);
        }
        
        else if(role === 'subTeach') {
            $('input[name=markAttType]').each(function() {
                $(this).change(Event.changeMarkAttType);
            });
            $('#editMarkAttBtn').click(Event.editMarkAttTable);
        }
    } 

    _Bind.markAttControl = function() {
        $('#saveMarkAttBtn').click(_submitMarkAttTable);
        $('#cancelMarkAttBtn').click(_restoreMarkAttTable);
        $('#markAttTable').on('validate', function(evt, value) {
            if(value === '') {
                return true;
            }
            else {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }
        });
    }

    //---------- Ui._Field ----------//

    _Field.student = function() {
        var selectedStud = $('#studList option:selected').val();
        return selectedStud;
    }

    _Field.semester = function() {
        var sem = $('#semesterInp').val();
        sem = parseInt(Number(sem), 10);
        return sem;
    }

    _Field.validateSem = function() {
        var sem = _Field.semester(); 
        if(sem < 1 || sem > 10) {
            return false;
        }
        else {
            return true;
        }
    }

    _Field.markAttType = function() {
        var selectedType = $('input[name=markAttType]:checked').val(); 
        return selectedType;
    }

    //---------- Ui._Error ----------//

    _Error.roleFetch = function() {
        var msg = {
            first : " Failed to fetch Teacher's roles. ",
            middle : "Please 'Refresh' the page"
        }
        _pasteHtml('headerInfo', _template.fail, msg);
    }

    _Error.dashFetch = function() {
        var msg = {
            first : " Failed to fetch some UI components. ",
            middle : "Please select the role again"
        }
        _pasteHtml('headerInfo', _template.fail, msg);
    }

    _Error.studFetch = function() {
        var msg = {
            first : " Failed to list of students. ",
            middle : "Please select the role again"
        }
        _pasteHtml('headerInfo', _template.fail, msg);
    }

    _Error.invalidSem = function() {
        var msg = {
            first : " Semester value should be between 1 to 10. ",
            middle : "Try again..!"
        }
        _toastHtml('headerInfo', _template.info, msg, 3500);
    }

    _Error.reportFetch = function() {
        var msg = {
            first : " Failed to fetch the report. ",
            middle : "Try again..!"
        }
        _toastHtml('headerInfo', _template.fail, msg, 3500);
    }

    _Error.credtisFetch = function() {
        var html = _template.failPopover;
        $('creditsBtn').attr('data-content', html);
    }

    _Error.cgpaFetch = function() {
        var html = _template.failPopover;
        $('cgpaBtn').attr('data-content', html);
    }

    _Error.markAttFetch = function() {
        var msg = {
            first : " Failed to fetch " + _Field.markAttType().toUpperCase() + " details. ",
            middle : "Try again..!"
        }
        _toastHtml('headerInfo', _template.fail, msg, 3500);
    }
    
    _Error.markAttSubmit = function() {
        var msg = {
            first : " Something went wrong. ",
            middle : "Try again..!"
        }
        _toastHtml('markAttFooter', _template.fail, msg, 3500);
    }

    TEACH.Ui = {
        init : init,
        Event : Event
    }
    return TEACH;
}(TEACH || {}));
