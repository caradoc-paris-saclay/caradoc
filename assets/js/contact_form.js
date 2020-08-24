// helper function to get value from input forms
function getInputVal(id){
  return document.getElementById(id).value;
}
function setInputVal(id, val){
  document.getElementById(id).value = val;
}

//Listen to click on submit
document.getElementById('contact_form').addEventListener('submit', submitForm);

//Submit Form
function submitForm(e){
  e.preventDefault();
  // Variables from input fields
  var firstName = getInputVal('first_name');
  var lastName = getInputVal('last_name');
  var email = getInputVal('email').replace(/\s/g, ''); //remove white spaces
  var emailId = email.replace("@","").replace(/\./g,""); 
  var emailConfirmation = getInputVal('email_confirmation').replace(/\s/g, '');
  var emailNoMatch = email.localeCompare(emailConfirmation);
  if (emailNoMatch != 0){
    console.log("Error: e-mails don't match!");
    document.getElementById('emailNoMatch').style.display = "block";
    alert("Emails provided don't match. Please check again.")
    return false; // break before submission
  }
  else{
    document.getElementById('emailNoMatch').style.display = "none";
  }
  var subject = getInputVal('subject');
  var message = getInputVal('message');
  var xhr = new XMLHttpRequest();
	xhr.open("POST", $("#contact_form").attr('sendTo'), true);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send(JSON.stringify({
		first_name: firstName,
		last_name: lastName,
		_replyto: email,
		email: email,
		_subject:subject,
		message:message
	}));

  //save participant
  // check if id was provided and we are just updating an already existing participant
  // check if e-mail already exist to prevent making double entry for same e-mail
  document.getElementById('submission_msg').style.display = "block";
  document.getElementById('contact_form').reset();
  $(function() {$('#submission_msg').modal("show");});
    //data-toggle="modal" data-target="#submission_msg"
}
