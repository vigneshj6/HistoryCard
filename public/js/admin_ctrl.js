var batch_list_Hb, user_list_Hb, subject_list_Hb, assign_list_Hb, assign_table_Hb, response;

var tab_init_html, tab_error_html, loading_error_html;

var fetched_user_html = false;
var fetched_subject_html = false;
var fetched_assign_html = false;

var item_c = 0;

$(document).ready(function(){

  tab_init_html = '<div class="alert alert-info text-center">\
                        <span><i class="fa fa-circle-o-notch fa-spin"></i> <strong>Loading..</strong></span>\
                      </div>';

  tab_error_html = '<div class="alert alert-danger text-center">\
                        <span><i class="fa fa-exclamation-triangle"></i> <strong>Error: </strong>Failed to load. Try agian by clicking the tab.</span>\
                      </div>';

  loading_error_html = '<div class="alert alert-danger text-center">\
                      <span><i class="fa fa-exclamation-triangle"></i> <strong>Error: </strong>Failed to load. Try agian.</span>\
                    </div>';


  var batch_list_template = '{{#each batch}}\
            <li class="clearfix list-group-item{{#even-item}}{{/even-item}}">\
              <div class="btn-group-xs pull-right">\
                <button type="button" class="btn btn-default" onclick="show_modal(\'edit_batch_modal\', \'{{name}}\')">Edit</button>\
                    <button type="button" class="btn btn-primary" onclick="show_modal(\'update_batch_modal\', \'{{name}}\')">Update</button>\
                    <button type="button" class="btn btn-success" onclick="show_modal(\'backup_batch_modal\', \'{{name}}\')">Backup</button>\
                    <button type="button" class="btn btn-danger" onclick="show_modal(\'delete_batch_modal\', \'{{name}}\')">Delete</button>\
              </div>\
              {{name}}\
            </li>{{/each}}';


   var user_list_template = '{{#each users}}\
                             <li class="clearfix list-group-item{{#even-item}}{{/even-item}}">\
                             <div class="btn-group-xs pull-right">\
                             <button type="button" class="btn btn-default" onclick="show_modal(\'edit_user_modal\',\'{{id}}\')">Edit</button>\
                             <button type="button" class="btn btn-danger" onclick="show_modal(\'delete_user_modal\',&#123;\'id\'&#58;\'{{id}}\'&#44;\'type\'&#58;\'{{type}}\'&#125;)">Delete</button>\
                             </div>\
                             {{id}}\
                             </li>\
                             {{/each}}';

   var subject_list_template = '{{#each subjects}}\
                             <li class="clearfix list-group-item{{#even-item}}{{/even-item}}">\
                             <div class="btn-group-xs pull-right">\
                             <button type="button" class="btn btn-default" onclick="show_modal(\'edit_subject_modal\',\'{{sub_code}}\')">Edit</button>\
                             <button type="button" class="btn btn-danger" onclick="show_modal(\'delete_subject_modal\',\'{{sub_code}}\')">Delete</button>\
                             </div>\
                             {{sub_code}}\
                             </li>\
                             {{/each}}';

   var assign_list_template = '{{#each users}}\
                             <li class="clearfix list-group-item{{#even-item}}{{/even-item}}">\
                             <div class="btn-group-xs pull-right">\
                             <button type="button" class="btn btn-danger" onclick="show_modal(\'assign_assign_modal\',\'{{id}}\')">Assign</button>\
                             <button type="button" class="btn btn-primary" onclick="show_modal(\'show_assign_modal\',\'{{id}}\')">Show</button>\
                             </div>\
                             {{id}}\
                             </li>\
                             {{/each}}';

    var assign_table_template = "{{#each assignments}}\
                                 <tr>\
                                 {{#if sub_code}}\
                          			 <td>{{role}} - {{sub_code}}</td>\
                                 {{else}}\
                                 <td>{{role}}</td>\
                                 {{/if}}\
                          			 <td>{{batch}}</td>\
                          			 <td>{{department}}</td>\
                          			 <td>{{section}}</td>\
                          			 <td>{{students}}</td>\
                                 <td><button type='button' class='btn btn-danger btn-xs'\
                                 {{#if sub_code}}\
                          			 onclick='assign_deassign(\"{{@root.id}}\",\"{{role}}\", \"{{sub_code}}\", \"{{batch}}\", \"{{department}}\", \"{{section}}\")'>\
                                 {{else}}\
                                 onclick='assign_deassign(\"{{@root.id}}\",\"{{role}}\")'>\
                                 {{/if}} De-assign</button></td>\
                            		 </tr>\
                              	 {{/each}}";

   batch_list_Hb = Handlebars.compile(batch_list_template);
   user_list_Hb = Handlebars.compile(user_list_template);
   subject_list_Hb = Handlebars.compile(subject_list_template);
   assign_list_Hb = Handlebars.compile(assign_list_template);
   assign_table_Hb = Handlebars.compile(assign_table_template);


  Handlebars.registerHelper('even-item',function() {
    item_c += 1;
    return item_c%2?" list-even":"";
  });

  Handlebars.registerHelper('qo',function(options) {
    return "'" + options.fn(this) + "'";
  });

});

function toast(div_id, div_html, delay) {
  $('#' + div_id).html(div_html);
  setTimeout(function() {
    $('#' + div_id).empty();
    }, delay);
}

function fetch_tab(tab_id) {

  if(tab_id == 'user' && fetched_user_html) return;
  else if(tab_id == 'subject' && fetched_subject_html) return;
  else if(tab_id == 'assign' && fetched_assign_html) return;

  else {

    $('#' + tab_id).html(tab_init_html);

    var request = $.ajax({
      url: window.location.pathname + '/' + tab_id + '-html',
      type: "GET",
      cache: false,
      dataType: "html",
    });

    request.done(function(response){
      $('#' + tab_id).html(response);
      if(tab_id == 'user')
        fetched_user_html = true;
      else if(tab_id == 'subject')
        fetched_subject_html = true;
      else if(tab_id == 'assign')
        fetched_assign_html = true;
    });

    request.fail(function(jqXHR, error_status, error_text){
      $('#' + tab_id).html(tab_error_html);
    });
  }
}

function show_modal(modal_id, extra) {

  $('#'+modal_id).modal({backdrop:"static"});
  
  if(modal_id == "add_batch_modal") {
    $('#add_batch_form').trigger('reset');
  }
  
  else if(modal_id == "edit_batch_modal") {
    update_form_edit_batch(extra);
  }
  
  else if(modal_id == "update_batch_modal") {
    $('#updateBatchName').val(extra);
  }
  
  else if(modal_id == "backup_batch_modal") {
    $('#backupBatchName').val(extra);
  }
  
  else if(modal_id == "delete_batch_modal") {
    $('#deleteBatchName').val(extra);
  }
  
  else if(modal_id == "add_user_modal") {
    $('#add_stud_form').trigger('reset');
    $('#add_teac_form').trigger('reset');
    $('#divStudResetPasswd').hide();
    $('#divTeacResetPasswd').hide();
  }
  else if(modal_id == "edit_user_modal") {
    $('#edit_user_form').empty();
    $('#divStudResetPasswd').show();
    $('#divTeacResetPasswd').show();
    update_form_edit_user(extra);
  }

  else if(modal_id == "delete_user_modal") {
    $("#delete_user_id").val(extra.id);
    $("#delete_user_type").val(extra.type);
  }

  else if(modal_id == "add_subject_modal") {
    $('#subject_add_form').trigger('reset');
  }
  else if(modal_id == "edit_subject_modal") {
    $('#subject_edit_form').empty();
    update_form_subject_edit(extra, subject_list_batch);
  }

  else if(modal_id == "delete_subject_modal") {
    $("#delete_subject_batch").val(subject_list_batch);
    $("#delete_subject_code").val(extra);
  }

  else if(modal_id == "assign_assign_modal") {
    $('#assign_classAdv_staff').val(extra);
    $('#assign_facultyAdv_staff').val(extra);
    $('#assign_subject_staff').val(extra);
  }

  else if(modal_id == "assign_show_modal") {
    assign_show(extra);
  }

}

//----------------------------------------------
// BATCH_TAB_FUNCTIONS
//----------------------------------------------

var batch_list_search = false;
var batch_list_query = "";

function batch_url_data() {
  if(!batch_list_search)
    var url_data = {};
  else
    var url_data = { query : batch_list_query };

  return url_data;
}

function refresh_batch_list() {
  var request = $.ajax({
    url: window.location.pathname + "/batch-list",
    type: 'GET',
    cache: false,
    data: batch_url_data(),
    dataType: "json",
  });

  request.done(function(response) {
    var batch_list_html = batch_list_Hb(response);
    $('#batch_list').html(batch_list_html);

    $('#batch_search_btn').button('reset');
  });

  request.fail(function(jqXHR, error_status, error_text) {
    toast('batch_list_footer_info', 'Error in loading list. Try again.', 3500);
    $('#batch_search_btn').button('reset');
  });
}

function batch_search() {
  batch_list_search = true;
  batch_list_query = $('#batch_query_inp').val();
  $('#batch_search_btn').button('loading');
  refresh_batch_list();
  return false;
}

function batch_search_clear() {
  batch_list_search = false;
  batch_list_query = "";
  $('#batch_query_inp').val('');
  $('#batch_search_btn').button('reset');
  refresh_batch_list();
}

function add_batch() {

  $('#add_batch_btn').button('loading');
  
  var batch_name = $('#add_batch_form input[name=batch]').val();
  
  var request = $.ajax({
    url: window.location.pathname + "/batch-add?batch=" + batch_name,
    cache: false,
    type: 'GET',
    dataType: 'json',
  });

  request.done(function(response) {
    $('#add_batch_btn').button('reset');
    var add_batch_success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var add_batch_error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success) {
      toast('batch_list_footer_info', add_batch_success_html, 2000);
      refresh_batch_list();
      $('#add_batch_modal').modal('hide');
    }
    else
      toast('add_batch_info', add_batch_error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#add_batch_btn').button('reset');
    var add_batch_error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('add_batch_info', add_batch_error_html, 3500);
  });
  
   
}

function update_form_edit_batch(batch_name) {

  var request = $.ajax({
    url: window.location.pathname + '/batch-edit?batch=' + batch_name,
    cache: false,
    type: 'GET',
    dataType: 'json'
  });

  request.done(function(response) {
    
      $('#edit_batch_form input[name=batch]').val(response.name);
      if(response.old_batch === true)
        $('#edit_batch_form input[name=old_batch]').prop('checked', true);
      $('#edit_batch_form #selectCurSem option[value=' + response.sem + ']').prop('selected', true);

      $('#edit_batch_info').empty();
  });

  request.fail(function(jqXHR, error_status, error_text){
    $('#edit_batch_info').html(loading_error_html);
  });
}


function submit_form_edit_batch() {

  $('#edit_batch_btn').button('loading');

  $('#edit_batch_form input[name=batch]').prop('disabled', false);
  var post_data = $('#edit_batch_form').serialize();
  $('#edit_batch_form input[name=batch]').prop('disabled', true);

  var request = $.ajax({
    url: window.location.pathname + "/batch-edit",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#edit_batch_btn').button('reset');
    var success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('edit_batch_info', success_html, 3500);
    else
      toast('edit_batch_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#edit_batch_btn').button('reset');
    var error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('edit_batch_info', error_html, 3500);
  });

}

function update_batch() {
  
  //code of uploading csv file using Ajax
  
  return false;
}

function delete_batch() {
  
  $('#delete_batch_btn').button("loading");
  
  var batch_name = $('#deleteBatchName').val();
  var super_key = $('#inputSuperKey').val();

  if(!super_key) {
    $('#inputSuperKey').attr("placeholder", "Please enter the super-key");
    $('#delete_batch_btn').button("reset");
    return false;
  }

  var request = $.ajax({
      url: window.location.pathname + "/batch-delete",
      cache: false,
      type: "POST",
      data: {"batch": batch_name, "key": super_key},
      dataType: 'json',
  });

  request.done(function(response) {
    $('#delete_batch_btn').button('reset');
    $('#delete_batch_modal').modal('hide');

    var success_html = '<div class="alert alert-info text-center col-md-9 no-margin">\
                          <span><i class="fa fa-check"></i> <strong>Batch has been successfully deleted!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success) {
      toast('batch_list_footer_info', success_html, 3500);
      refresh_batch_list();
    }
    else
      toast('batch_list_footer_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#delete_batch_btn').button('reset');
    $('#delete_batch_modal').modal('hide');
    var error_html = '<div class="alert alert-danger text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('batch_list_footer_info', error_html, 3500);
  });
  
  return false;

}

function download_batch_csv() {
  var batch_name = $('#backupBatchName').val();
  window.open(window.location.pathname + "/download-csv?batch=" + batch_name, "_blank");
}

function download_batch_sql() {
  var batch_name = $('#backupBatchName').val();
  window.open(window.location.pathname + "/download-sql?batch=" + batch_name, "_blank");
}


//----------------------------------------------
// USER_TAB_FUNCTIONS
//----------------------------------------------

var user_list_query = "";

var user_list_search = false;

var user_list_from = 0;

var user_list_type = "both";

var user_add_form = "add_stud_form";

function user_url_data() {
  if(!user_list_search)
    var url_data = "from=" + (user_list_from) + "&type=" + user_list_type;
  else
    var url_data = "from=" + (user_list_from) + "&query=" + user_list_query + "&type=" + user_list_type;

  return url_data;
}

//---------------------------------------------------------------

function refresh_user_list() {
  var request = $.ajax({
    url: window.location.pathname + "/user-list?" + user_url_data(),
    type: 'GET',
    cache: false,
    dataType: "json",
  });

  request.done(function(response) {
    var user_list_html = user_list_Hb(response);
    $('#user_list').html(user_list_html);

    $('#user_search_btn').button('reset');
  });

  request.fail(function(jqXHR, error_status, error_text) {
    toast('user_list_footer_info', 'Error in loading list. Try again.', 2000);
    $('#user_search_btn').button('reset');
  });
}

//---------------------------------------------------------------

function user_list_prev() {
  if(user_list_from>0)
    user_list_from = user_list_from - 20;
  else return;

  refresh_user_list();

}

//---------------------------------------------------------------

function user_list_next() {
  user_list_from = user_list_from + 20;

  refresh_user_list();
}

//---------------------------------------------------------------

function changeIn_user_type() {
  user_list_type = $('input[name=user_type]:checked').val();
  user_list_from = 0;

  refresh_user_list();
}


//---------------------------------------------------------------

function user_search() {
  user_list_search = true;
  user_list_query = $('#user_query_inp').val();
  user_list_from = 0;
  $('#user_search_btn').button('loading');
  refresh_user_list();
  return false;
}

function user_search_clear() {
  user_list_search = false;
  user_list_query = "";
  user_list_from = 0;
  $('#user_query_inp').val('');
  $('#user_search_btn').button('reset');
  refresh_user_list();
}


function user_active_form(form_id) {
  user_add_form = form_id;
}

function add_user() {
  var post_data;

  $('#add_user_btn').button('loading');

  if(user_add_form == "add_stud_form")
    post_data = $('#add_stud_form').serialize();
  else if(user_add_form == "add_teac_form")
    post_data = $('#add_teac_form').serialize();

  var request = $.ajax({
    url: window.location.pathname + "/user-add",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#add_user_btn').button('reset');
    var add_user_success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var add_user_error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('add_user_info', add_user_success_html, 2000);
    else
      toast('add_user_info', add_user_error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#add_user_btn').button('reset');
    var add_user_error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('add_user_info', add_user_error_html, 3500);

  });
}

function update_form_edit_user(user_id) {

  var request = $.ajax({
    url: window.location.pathname + '/user-edit?id=' + user_id,
    cache: false,
    type: 'GET',
    dataType: 'json'
  });

  request.done(function(response){

    if(response.type == "student") {
      var form_html = $('#add_stud_form').html();
      $('#edit_user_form').html(form_html);
      $('#edit_user_form input[name=type]').val(response.type);
      $('#edit_user_form input[name=id]').val(response.id);
      $('#edit_user_form input[name=id]').prop('disabled', true);
      $('#edit_user_form input[name=name]').val(response.name);
      $('#edit_user_form input[name=batch]').val(response.batch);
    }

    else if(response.type == "teacher") {
      var form_html = $('#add_teac_form').html();
      $('#edit_user_form').html(form_html);
      $('#edit_user_form input[name=type]').val(response.type);
      $('#edit_user_form input[name=id]').val(response.id);
      $('#edit_user_form input[name=id]').prop('disabled', true);
      $('#edit_user_form input[name=name]').val(response.name);
    }

    $('#edit_user_info').empty();
  });

  request.fail(function(jqXHR, error_status, error_text){
    $('#edit_user_info').html(loading_error_html);
  });
}

function submit_form_edit_user() {

  $('#edit_user_save_btn').button('loading');

  var post_data = "id=" + $('#edit_user_form input[name=id]').val() ;
  post_data = post_data + "&type=" + $('#edit_user_form input[name=type]').val() ;
  post_data = post_data + "&" + $('#edit_user_form :input:not(:hidden)').serialize();

  var request = $.ajax({
    url: window.location.pathname + "/user-edit",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#edit_user_save_btn').button('reset');
    var success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('edit_user_info', success_html, 3500);
    else
      toast('edit_user_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#edit_user_save_btn').button('reset');
    var error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('edit_user_info', error_html, 3500);
  });

}

function delete_user() {

  var id = $('#delete_user_id').val();
  var type = $('#delete_user_type').val();
  $('#delete_user_btn').button('loading');

  var request = $.ajax({
    url: window.location.pathname + "/user-delete?id=" + id + "&type=" + type,
    cache: false,
    type: "GET",
    dataType: "json",
  });

  request.done(function(response) {
    $('#delete_user_btn').button('reset');
    $('#delete_user_modal').modal('hide');

    var success_html = '<div class="alert alert-info text-center col-md-9 no-margin">\
                          <span><i class="fa fa-check"></i> <strong>User account has been successfully deleted!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success) {
      toast('user_list_footer_info', success_html, 3500);
      refresh_user_list();
    }
    else
      toast('user_list_footer_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#delete_user_btn').button('reset');
    $('#delete_user_modal').modal('hide');
    var error_html = '<div class="alert alert-danger text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('user_list_footer_info', error_html, 3500);
  });

}


//----------------------------------------------
// SUBJECT_TAB_FUNCTIONS
//----------------------------------------------

var subject_list_query = "";

var subject_list_search = false;

var subject_list_from = 0;

var subject_list_batch = "";

var subject_add_form = "add_stud_form";

function subject_url_data() {
  if(!subject_list_search)
    var url_data = "from=" + (subject_list_from) + "&batch=" + subject_list_batch;
  else
    var url_data = "from=" + (subject_list_from) + "&query=" + subject_list_query + "&batch=" + subject_list_batch;

  return url_data;

}

//---------------------------------------------------------------

function refresh_subject_list() {
  var request = $.ajax({
    url: window.location.pathname + "/subject-list?" + subject_url_data(),
    type: 'GET',
    cache: false,
    dataType: "json",
  });

  request.done(function(response) {
    var subject_list_html = subject_list_Hb(response);
    $('#subject_list').html(subject_list_html);

    $('#subject_search_btn').button('reset');
  });

  request.fail(function(jqXHR, error_status, error_text) {
    toast('subject_list_footer_info', 'Error in loading list. Try again.', 2000);
    $('#subject_search_btn').button('reset');
  });
}

//---------------------------------------------------------------

function subject_list_prev() {
  if(subject_list_from>0)
    subject_list_from = subject_list_from - 20;
  else return;

  refresh_subject_list();

}

//---------------------------------------------------------------

function subject_list_next() {
  subject_list_from = subject_list_from + 20;

  refresh_subject_list();
}

//---------------------------------------------------------------

function changeIn_subject_batch() {
  if(!subject_list_batch) {
    $('#subject_search_btn').prop('disabled', false);
    $('#subject_prev_btn').prop('disabled', false);
    $('#subject_next_btn').prop('disabled', false);
  }
  subject_list_batch = $('input[name=subject_batch]:checked').val();
  subject_list_from = 0;
  refresh_subject_list();
}


//---------------------------------------------------------------

function subject_search() {
  subject_list_search = true;
  subject_list_query = $('#subject_query_inp').val();
  subject_list_from = 0;
  $('#subject_search_btn').button('loading');
  refresh_subject_list();
  return false;
}

function subject_search_clear() {
  subject_list_search = false;
  subject_list_query = "";
  subject_list_from = 0;
  $('#subject_query_inp').val('');
  $('#subject_search_btn').button('reset');
  refresh_subject_list();
}

function add_subject() {
  var post_data;

  $('#add_subject_btn').button('loading');
  post_data = $('#subject_add_form').serialize();

  var request = $.ajax({
    url: window.location.pathname + "/subject-add",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#add_subject_btn').button('reset');
    var add_subject_success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var add_subject_error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('add_subject_info', add_subject_success_html, 2000);
    else
      toast('add_subject_info', add_subject_error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#add_subject_btn').button('reset');
    var add_subject_error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('add_subject_info', add_subject_error_html, 3500);

  });
}

function update_form_subject_edit(sub_code, batch) {

  var request = $.ajax({
    url: window.location.pathname + '/subject-edit?sub_code=' + sub_code + '&batch=' + batch,
    cache: false,
    type: 'GET',
    dataType: 'json'
  });

  request.done(function(response) {

    var form_html = $('#subject_add_form').html();
    $('#subject_edit_form').html(form_html);
    $('#subject_edit_form option[value=' + response.batch + ']').prop('selected', true);
    $('#subject_edit_form input[name=sub_code]').val(response.sub_code);
    $('#subject_edit_form select[name=batch]').prop('disabled', true);
    $('#subject_edit_form input[name=sub_code]').prop('disabled', true);
    $('#subject_edit_form input[name=sub_name]').val(response.sub_name);
    $('#subject_edit_form input[name=sub_credits]').val(response.sub_credits);
    $('#edit_subject_info').empty();
  });

  request.fail(function(jqXHR, error_status, error_text){
    $('#edit_subject_info').html(loading_error_html);
  });
}

function submit_form_subject_edit() {

  $('#edit_subject_btn').button('loading');

  var post_data = "batch=" + $('#subject_edit_form select[name=batch]').val();
  post_data = post_data + "&sub_code=" + $('#subject_edit_form input[name=sub_code]').val();
  post_data = post_data + "&" + $('#subject_edit_form').serialize();

  var request = $.ajax({
    url: window.location.pathname + "/subject-edit",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#edit_subject_btn').button('reset');
    var success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('edit_subject_info', success_html, 3500);
    else
      toast('edit_subject_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#edit_subject_btn').button('reset');
    var error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('edit_subject_info', error_html, 3500);
  });

}

function delete_subject() {

  var batch = $('#delete_subject_batch').val();
  var sub_code = $('#delete_subject_code').val();
  $('#delete_subject_btn').button('loading');

  var url_data = "batch=" + batch + "&sub_code=" + sub_code;

  var request = $.ajax({
    url: window.location.pathname + "/subject-delete?" + url_data,
    cache: false,
    type: "GET",
    dataType: "json",
  });

  request.done(function(response) {
    $('#delete_subject_btn').button('reset');
    $('#delete_subject_modal').modal('hide');

    var success_html = '<div class="alert alert-info text-center col-md-9 no-margin">\
                          <span><i class="fa fa-check"></i> <strong>subject account has been successfully deleted!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success) {
      toast('subject_list_footer_info', success_html, 3500);
      refresh_subject_list();
    }
    else
      toast('subject_list_footer_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#delete_subject_btn').button('reset');
    $('#delete_subject_modal').modal('hide');
    var error_html = '<div class="alert alert-danger text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('subject_list_footer_info', error_html, 3500);
  });

}

//----------------------------------------------
// assign_TAB_FUNCTIONS
//----------------------------------------------

var assign_list_query = "";

var assign_list_search = false;

var assign_list_from = 0;

var assign_list_dept = "all";

var assign_assign_form = "assign_classAdv_form";

function assign_url_data() {
  if(!assign_list_search)
    var url_data = "from=" + (assign_list_from) + "&dept=" + assign_list_dept;
  else
    var url_data = "from=" + (assign_list_from) + "&query=" + assign_list_query + "&dept=" + assign_list_dept;

  return url_data;
}

//---------------------------------------------------------------

function refresh_assign_list() {
  var request = $.ajax({
    url: window.location.pathname + "/assign-list?" + assign_url_data(),
    type: 'GET',
    cache: false,
    dataType: "json",
  });

  request.done(function(response) {
    var assign_list_html = assign_list_Hb(response);
    $('#assign_list').html(assign_list_html);

    $('#assign_search_btn').button('reset');
  });

  request.fail(function(jqXHR, error_status, error_text) {
    toast('assign_list_footer_info', 'Error in loading list. Try again.', 2000);
    $('#assign_search_btn').button('reset');
  });
}

//---------------------------------------------------------------

function assign_list_prev() {
  if(assign_list_from>0)
    assign_list_from = assign_list_from - 20;
  else return;

  refresh_assign_list();

}

//---------------------------------------------------------------

function assign_list_next() {
  assign_list_from = assign_list_from + 20;

  refresh_assign_list();
}

//---------------------------------------------------------------

function changeIn_assign_dept() {
  assign_list_dept = $('input[name=assign_dept]:checked').val();
  assign_list_from = 0;

  refresh_assign_list();
}


//---------------------------------------------------------------

function assign_search() {
  assign_list_search = true;
  assign_list_query = $('#assign_query_inp').val();
  assign_list_from = 0;
  $('#assign_search_btn').button('loading');
  refresh_assign_list();
  return false;
}

function assign_search_clear() {
  assign_list_search = false;
  assign_list_query = "";
  assign_list_from = 0;
  $('#assign_query_inp').val('');
  $('#assign_search_btn').button('reset');
  refresh_assign_list();
}

function assign_active_form(form_id) {
  assign_assign_form = form_id;
  $('')
}

function assign_assign() {
  var post_data = "staff=" + $('#assign_classAdv_form input[name=staff]').val();

  $('#assign_assign_btn').button('loading');

  if(assign_assign_form == "assign_classAdv_form") {
    post_data = post_data + "&" + $('#assign_classAdv_form').serialize();
  }

  else if(assign_assign_form == "assign_facultyAdv_form") {
    post_data = post_data + "&" + $('#assign_facultyAdv_form').serialize();
  }

  else if(assign_assign_form == "assign_subject_form") {
    post_data = post_data + "&" + $('#assign_subject_form').serialize();
  }

  var request = $.ajax({
    url: window.location.pathname + "/assign-assign",
    cache: false,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });

  request.done(function(response) {
    $('#assign_assign_btn').button('reset');
    var assign_assign_success_html = '<div class="alert alert-info text-center">\
                          <span><i class="fa fa-check"></i> <strong>Success!</strong></span>\
                        </div>';

    var assign_assign_error_html = '<div class="alert alert-warning text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success)
      toast('assign_assign_info', assign_assign_success_html, 2000);
    else
      toast('assign_assign_info', assign_assign_error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    $('#assign_assign_btn').button('reset');
    var assign_assign_error_html = '<div class="alert alert-danger text-center">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('assign_assign_info', assign_assign_error_html, 3500);

  });
}

function assign_stud_list() {

  if(assign_assign_form == "assign_facultyAdv_form") {
    post_data = $('#assign_facultyAdv_form').serialize();
  }

  else if(assign_assign_form == "assign_subject_form") {
    post_data = $('#assign_subject_form').serialize();
  }


  var request = $.ajax({
    url: window.location.pathname + "/assign-stud-list",
    cache: false,
    type: "POST",
    data: post_data,
    dataType: "json",
  });

  request.done(function(response) {

    var success_html = '<div class="alert alert-info text-center col-md-9 no-margin">\
                          <span><i class="fa fa-check"></i> <strong>assign account has been successfully deleted!</strong></span>\
                        </div>';

    var error_html = '<div class="alert alert-warning text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';

    if(response.success) {
      var stud_list_html = "";
      response.stud.forEach(function(item) {
        stud_list_html = stud_list_html + '<option value="' + item + '">' + item + '</option>';
      });
      $('#' + assign_assign_form  + ' select[name=stud]').html(stud_list_html);
    }
    else
      toast('assign_assign_info', error_html, 3500);

  });

  request.fail(function(jqXHR, error_status, error_text) {
    var error_html = '<div class="alert alert-danger text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('assign_assign_info', error_html, 3500);
  });
}

function assign_show(staff_id) {
  var request = $.ajax({
    url: window.location.pathname + '/assign-show?id=' + staff_id,
    cache: true,
    type: 'GET',
    dataType: 'json',
  });

  request.done(function(response){
    var assign_table_html = assign_table_Hb(response);
    $('#assign_show_table_body').html(assign_table_html);
    $('#assign_show_info').empty();
  });

  request.fail(function(jqXHR, error_status, error_text){
    toast('assign_show_info', loading_error_html, 3500);
  });
}

function assign_deassign(id, role, sub_code, batch, dept, section) {
  var post_data;
  if(role === "Class Advisor" || role === "Faculty Advisor") {
    post_data = {
      id : id,
      role : role
    }
  }
  else {
    post_data = {
      id : id,
      role : role,
      sub_code : sub_code,
      batch : batch,
      dept : dept,
      section : section
    }
  }
  
  var request = $.ajax({
    url: window.location.pathname + '/assign-deassign',
    cache: true,
    type: 'POST',
    data: post_data,
    dataType: 'json',
  });
  
  var success_html = '<div class="alert alert-info text-center col-md-9 no-margin">\
                          <span><i class="fa fa-check"></i> <strong>assign account has been successfully deleted!</strong></span>\
                        </div>';
                        
  request.done(function(response){
    if(response.success) {
     toast('assign_show_info', success_html, 3500);
     assign_show(id);     
    }
    else {
     var error_html = '<div class="alert alert-warning text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> ' + response.error_text + '</span>\
                        </div>';
     toast('assign_show_info', error_html, 3500);                   
    }
  });

  request.fail(function(jqXHR, error_status, error_text){
    var error_html = '<div class="alert alert-danger text-center col-md-9 no-margin">\
                          <span><i class="fa fa-exclamation-triangle"></i> Something went wrong. <strong>Try again!</strong></span>\
                        </div>';
    toast('assign_show_info', error_html, 3500);
  });
}
