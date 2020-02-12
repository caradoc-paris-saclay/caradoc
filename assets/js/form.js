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
//Uncomment this line then use the URL on 2nd line in the webrowser
processUser();
//http://127.0.0.1:4000/reg_form_test_arnaud.html/?firstname=Arnaud&lastname=Jean
//
function processUser()
  {
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    l = unescape(temp[1]);
    temp = parameters[1].split("=");
    p = unescape(temp[1]);
    document.getElementById("firstname").value = l;
    document.getElementById("lastname").value = p;
    console.log("Parsing URL:");
    console.log(l);
    console.log(p);
  }
//Submit Form
function submitForm(e){
  e.preventDefault();
  var firstname = getInputVal('firstname');
  var lastname = getInputVal('lastname');
  var email = getInputVal('email').replace(/\s/g, ''); //remove white spaces
  var emailConfirmation = getInputVal('emailConfirmation').replace(/\s/g, '');
  var emailNoMatch = email.localeCompare(emailConfirmation);
  var phone = getInputVal('phone');
  // emailNoMatch
  console.log(email);
  console.log(emailConfirmation);
  console.log("Do e-mails match?");
  if (emailNoMatch != 0){
      console.log("No match!");
      document.getElementById('emailNoMatch').style.display = "block";
      return false;
  }
  else{
    document.getElementById('emailNoMatch').style.display = "none";
  }

  //save participant
  saveParticipant(firstname, lastname, email, phone);

  document.getElementById('submissionMsg').style.display = "block";
  document.getElementById('registrationform').reset();
}

function getInputVal(id){
  return document.getElementById(id).value;
}

function saveParticipant(firstname, lastname, email, phone){
  console.log("hello");
  db.collection('participants').add({
    contact:{
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone
    },
    professional:{
      doctoralschool:""
    }
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
    document.getElementById("university").style.required = true;
    document.getElementById("phdyear").style.required = true;
  }
  else {
    $('.phd_student_block').css("display", "none");
    document.getElementById("university").style.required = false;
    document.getElementById("phdyear").style.required = false;
  } 
}

function showUniversity(val) {
    var x = document.getElementById("another_university");
    if(val === 'OTHER'){
      if (x.style.display === "none"){
        document.getElementById("university").style.required=false;
        x.style.required = true;
        x.style.display = "block";
      }
    }
    else {
      document.getElementById("university").style.required = true;
      x.style.required = false;
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
function changeWorkshopList() {
    /*Retrieve existing lists*/
    // Master list
    /*var yearList = document.getElementById("phdyear");
    // Slave list
    var workshopList = document.getElementById("workshop");

    /* Retrive seleted item from master list*/
    /*var currentYear = yearList.options[yearList.selectedIndex].value;*/
    // Clean slave list
    /*while (workshopList.options.length) {
      workshopList.remove(0);
    }*/

    /*Retreive corresponding workshop list in function fof the current year*/
    /*var slotsList = yearAndWorkshops[currentYear];*/

    // Add workshop list to the corresponding <select> element
  /*  if (slotsList) {
      var i;
      for (i = 0; i < slotsList.length; i++) {
        var slot = new Option(slotsList[i], i);
        workshopList.options.add(slot);
      }
    }*/
}