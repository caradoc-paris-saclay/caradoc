// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCEMl2rBQqmY5YzqKGfYLy0VgLug7HQZ7o",
  authDomain: "caradoc-b9cfd.firebaseapp.com",
  databaseURL: "https://caradoc-b9cfd.firebaseio.com",
  projectId: "caradoc-b9cfd",
  storageBucket: "caradoc-b9cfd.appspot.com",
  messagingSenderId: "1013854021090",
  appId: "1:1013854021090:web:5268ed8763c40c9f1b45bb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Reference account collection

var participantRef = firebase.database().ref('participants');

//Listen to click on submit
document.getElementById('registrationform').addEventListener('submit', submitForm);
//Submit Form
function submitForm(e){
  e.preventDefault();
  var name = getInputVal('name');
  var email = getInputVal('email').replace(/\s/g, ''); //remove white spaces
  var emailConfirmation = getInputVal('emailConfirmation').replace(/\s/g, '');
  var emailNoMatch = email.localeCompare(emailConfirmation);
  // emailNoMatch
  console.log(email);
  console.log(emailConfirmation);
  console.log("Do e-mails match?");
  if (emailNoMatch){
      console.log("No match!");
      document.getElementById('emailNoMatch').style.display = "block";
      return false;
  }
  else{
    document.getElementById('emailNoMatch').style.display = "none";
  }

  //save participant
  saveParticipant(name, email);

  document.getElementById('submissionMsg').style.display = "block";
  document.getElementById('registrationform').reset();
}

function getInputVal(id){
  return document.getElementById(id).value;
}

function saveParticipant(name, email){
  var newParticipantRef = participantRef.push();
  newParticipantRef.set({
    name: name,
    email: email
  });
}