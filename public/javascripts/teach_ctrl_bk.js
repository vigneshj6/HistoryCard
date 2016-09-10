//--------------- Variables-block -----------------------//

//handlebar-template variable
var template;

//html-content which will be given to the handlebars-template for generating report-table details
var tooltiptext = "<p class=\"text-left margin-tb\"><b>Subject Name : </b> {{sub_name}}<br><b>Credits : </b> {{credits}}</p>";
var template_content = "{{#each sub_record}}\
        <tr>\
				<td data-toggle='tooltip' title='" + tooltiptext + "' data-placement='auto right' data-container='#report_table_body' data-html='true'>\
				{{sub_code}}</td>\
				<td>{{cat1_mark}}</td>\
				<td>{{cat1_att}}</td>\
				<td>{{cat2_mark}}</td>\
				<td>{{cat2_att}}</td>\
				<td>{{cat3_mark}}</td>\
				<td>{{cat3_att}}</td>\
				<td>{{int_mark}}</td>\
				<td>{{cumm_att}}</td>\
				<td>{{grade}}</td>\
				<td>{{arrear}}</td>\
				<td>{{redo}}</td>\
			</tr>\
		{{/each}}\
		<tr><th colspan='12' class='text-right'>GPA: {{gpa}}&emsp;&emsp;</th></tr>";


//initializing to Infinity 		
var cgpa = Infinity;
var credits = Infinity;
var current_sem = Infinity;

//________________________________________________________//


//----------------- Functions-block ----------------------//


//--------------- document.ready function ----------------//

//things which has to done when html doc is ready
$(document).ready(function(){
  
  //compile html content into a handlebars-template
  template = Handlebars.compile(template_content);
  
  //enable popover box
  $('[data-toggle="popover"]').popover();
  
  //to hide popover box when 'x' button is clicked.
  $(document).on("click", ".popover .close" , function(){
        $(this).parents(".popover").popover('hide');
    });
    
	//to append current url-path in action attribute of upload form
	$('#upload_form').submit(function(e){
	  $(this).attr('action', window.location.pathname + '/upload');
		});
		
	//initially the prev_btn and next_btn will be in a disabled state	
	$('#report_prev').prop('disabled', true);
	$('#report_next').prop('disabled', true);
});
//_______________________________________________________//


//------------------ report_next function ---------------//
//to get the details of next sem
function getReportNext() {
  current_sem++;
  
  $('#report_form input').val(current_sem);
  $('#report_form').submit();
  
//enable or disabling next button
  if(current_sem==8)
    $('#report_next').prop('disabled', true);
  else
    $('#report_next').prop('disabled', false);

}
//_______________________________________________________//


//------------------ report_next function ---------------//
//to get the details of next sem
function getReportPrev() {
  current_sem--;
  
  $('#report_form input').val(current_sem);
  $('#report_form').submit();
  
//enable or disabling prev button
  if(current_sem==1)
    $('#report_prev').prop('disabled', true);
  else
    $('#report_prev').prop('disabled', false);
}
//_______________________________________________________//


//-------------------- getCgpa function -----------------//

//to give ajax request, get CGPA and show it in a popover box
function getCgpa() {

  //to close credit's popver box in case if it is open
  $('#credits_btn').popover('hide');
  
  //to change the popover box's content to show a 'loading' message
  $('#cgpa_btn').attr('data-content', '<span class="fa fa-circle-o-notch fa-spin"></span> Loading..');

  //getting student's rrn
  var rrn = $('#rrn').val();
  
  //sending ajax request to '/cgpa'
  var request = $.ajax({
    url: window.location.pathname + "/cgpa",
    cache: false,
    type: "GET",
    data: {"rrn": rrn},
    dataType: 'json',
  });
  
  //when the ajax request-response is successful
  request.done(function(response){
    
    //change the cgpa var's value
    cgpa = response.cgpa;
    
    //change popover box's content
    $('#cgpa_btn').attr('data-content', '<b>CGPA : </b>' + cgpa);
    
    //like refresh - because the popover content is changed
    $('#cgpa_btn').popover('show');
  });
  
  //when the ajax request-response fails
  request.fail(function(jqXHR, textStatus, errorText){
    
    //change the popover box's content to show request failed message
    $('#cgpa_btn').attr('data-content', '<b>Failed </b>to fetch data. Try again..');
    
    //like refresh - because the popover content is changed
    $('#cgpa_btn').popover('show');
  });
  
}

//_______________________________________________________//


//------------- getCredits function ---------------------//

//to give ajax request for Credits, get the credits json and show it in the popover box
function getCredits() {
  
  //to close CGPA's popver box in case if it is open
  $('#cgpa_btn').popover('hide');
  
  //to change the popover box's content to show a 'loading' message
  $('#credits_btn').attr('data-content', '<span class="fa fa-circle-o-notch fa-spin"></span> Loading..');
  
  //getting student's rrn
  var rrn = $('#rrn').val();
  
  //sending ajax request to '/credits'
  var request = $.ajax({
    url: window.location.pathname + "/credits",
    cache: false,
    type: "GET",
    data: {"rrn": rrn},
    dataType: 'json',
  });
  
  //when the ajax request-response is successful
  request.done(function(response){
    
    //popover box's content
    var credits_content = '';
    
    //total credits is initialized to zero
    credits = 0;
    
    //to iterate the response json and create html output as you see in the popover box
    for(var key in response) {
      var sem_name = key.slice(0,3).toUpperCase() + " - " + key.slice(-1);
      credits_content += "<b>" + sem_name + " : </b>" + response[key] + "<br>"
      
      //adding credits of each sem to show total #credits until finished sem 
      credits += response[key];
    }
    credits_content += "----------------<br>";
    credits_content += "<b>Total : </b>" + credits;
    
    //to change the popover box's content
    $('#credits_btn').attr('data-content', credits_content);
    
    //like refresh - because the popover content is changed
    $('#credits_btn').popover('show');
  });
  
  //when the ajax request-response fails
  request.fail(function(jqXHR, textStatus, errorText){
    
    //to change the popover box's content to show a 'try again' message
    $('#credits_btn').attr('data-content', '<b>Failed </b>to fetch data. Try again..');
    
    //like refresh - because the popover content is changed
    $('#credits_btn').popover('show');
  });

}

//_______________________________________________________//


//------------- getGpaGraph function --------------------//

//function to get GPA of each sem until finished semester
// and to plot graph when user click 'GPA' button
function getGpaGraph(){

  //change the button status to loading - displays "loading.." text in the button
  $('#load3').button('loading');
  
  //to send ajax request to /gpa
  var request = $.ajax({
    url: window.location.pathname + "/gpa",
    cache: false,
    type: "GET",
    dataType: 'json',
  });
  
  //used to store GPA values along with 'GPA' as first value - dataset,dataset-name 
  //used to 'columns' field in c3.generate() - graph
  var list = ['GPA'];
  
  //used to store labels for each value
  var label = [];

  //when the ajax request-response is successfull
  request.done(function(response) {
    
    //push the contents in response json to 'list' and 'label' arrays
    var i = 0;
    for(var key in response) {
      list.push(response[key]);
      key = key.toUpperCase();
      label[i] = key[0] + key[1] + key[2] + " " + key[3];
      i++;
    }
  
    //resetting button status - displays actual text of the button
    $('#load3').button('reset'); 
    
    //generating graph and displaying it in #graph_body
    var chart = c3.generate({
      bindto: '#graph_body',
      data: {
        columns: [list],
        type: 'line'
      },
      axis: {
        x: {
          type: 'category',
          categories: label,
          padding: {left: -0.4, right: 0.5},
          label: {text: 'Semesters', position: 'outer-center'}
        },
        y: {
          label: {text: 'Grade Point Average (GPA)', position: 'outer-middle'}
        }
      }
    });

    //#graph_footer's text is set to empty
    //#graph_footer is used to display error - if ajax request failed
    $('#graph_footer').text('');

      
  });
  
  //when the ajax request-response fails
  request.fail(function(jqXHR, textStatus, errorText){
    
    //reset the state of 'GPA' button
    $('#load3').button('reset');
    
    //set #graph_body to empty
    $('#graph_body').text("");
    
    //display error message in #graph_footer    
    $('#graph_footer').text("Error - Couldn't able to fetch data");
    
  });
  
}

//_______________________________________________________//


//------------- getSemReport function -------------------//

//get details about particular semester and popluate table
function getSemReport(){
  
  var form = document.getElementById('report_form');  

  //change the button status to loading - displays "loading.." text in the button  
  $('#report_load_btn').button('loading');

  //get sem-number from the form
  var sem_val = form.elements[0].value;
  var rrn = $('#rrn').val();
  
  //sem-number validation
  //if validation fails, return;
  if((typeof sem_val=='number') || sem_val%1!=0 || sem_val<1 || sem_val>8) {
    alert("Semester value should be an integer between 1 to 8");
    $('#report_load_btn').button('reset');
    return false;
  }
  
  current_sem = sem_val;
  
  //enable or disabling next and prev buttons
  if(current_sem==1)
    $('#report_prev').prop('disabled', true);
  else
    $('#report_prev').prop('disabled', false);
  
  if(current_sem==8)
    $('#report_next').prop('disabled', true);
  else
    $('#report_next').prop('disabled', false);
  
  //setting semester field in both form (in report-tab and graph-tab) to 'sem_val'
  //we're changing details in both tabs. So when user types something in one tab
  //and click button then the value in other tab should also be changed
  //UI thing - #clearity :D
  $('#report_form input').val(sem_val);
  
  //sending ajax request to /report with query 'sem=sem_val'
  var request = $.ajax({
    url: window.location.pathname + "/report",
    cache: false,
    type: "GET",
    data: {"rrn": rrn, "sem": sem_val},
    dataType: 'json',
  });
  
  //when ajax request-response is successful
  request.done(function(response) {
    
    //using the compiled handlebars-template to generate the html output
    //put the html content in #report_table_body div
    var report_html = template(response);
    $('#report_table_body').html(report_html);
    
    //to enable jquery tooltip
    $("[data-toggle='tooltip']").tooltip();
    
    //resetting buttons to actual text in the button
    $('#report_load_btn').button('reset'); 
    
    //setting footers's content to empty
    //both footer divs are used to display errors 
    $('#table_footer').text('');
    
  });
  
  //when ajax request-response fails
  request.fail(function(jqXHR, textStatus, errorText){
    
    //resetting buttons - displays actual text of the button
    $('#report_load_btn').button('reset'); 
    
    //setting report_body and graph_body divs to empty
    $('#report_table_body').text("");
    
    //displays error messages in footers
    $('#table_footer').text("Error - Couldn't able to fetch data");
    
  });
  
  //to prevent form normal form submission
  return false;
}

//_______________________________________________________//

//_______________________________________________________//