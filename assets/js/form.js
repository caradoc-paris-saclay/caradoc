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
const db = firebase.firestore();

//Listen to click on submit
document.getElementById('registrationform').addEventListener('submit', submitForm);
//Submit Form
function submitForm(e){
  e.preventDefault();
  var firstname = getInputVal('firstname');
  var lastname = getInputVal('lastname');
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

function saveParticipant(firstname, lastname, email, phone){
  db.collection('participants').add({
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

//form helper functions

function isPhDStudent(val) {
  if(val === 'PhDStudent'){
    $('.phd_student_block').css("display", "flex");
  }
  else {
    $('.phd_student_block').css("display", "none");
  } 
}

function showUniversity(val) {
    var x = document.getElementById("another_university");
    if(val === 'OTHER'){
      if (x.style.display === "none"){
        x.style.display = "block";
      }
    }
    else {
      x.style.display = "none";
    }
  }

  function showSchool(val) {
    var x = document.getElementById("another_school");
    if(val === 'OTHER'){
      if (x.style.display === "none"){
        x.style.display = "block";
      }
    }
    else {
      x.style.display = "none";
    }
  }

  function showAdum(val) {
    var x = document.getElementById("adum_link");
    if(val === 'YES'){
      if (x.style.display === "none"){
        x.style.display = "block";
      }
    }
    else {
      x.style.display = "none";
    }
  }
