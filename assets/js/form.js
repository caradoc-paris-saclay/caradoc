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
document.getElementById('registration_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser
if (location.pathname.indexOf("reg_form_test") !== -1){
    processUser();
}
//http://127.0.0.1:4000/reg_form_test_arnaud.html/?firstname=Arnaud&lastname=Jean
//Function to get data from URL and load content from firebase-firestore db when existing
// TODO
function processUser()
{ 
  console.log("Parsing URL:");
  var parameters = location.search.substring(1).split("&");
  // check if array and if array is empty
  if (Array.isArray(parameters) && parameters.length){
    if (parameters[0] != ""){ 
      var temp = parameters[0].split("=");
      if (temp[0] === "id"){
         const id = unescape(temp[1]);
         console.log(id);
      }
      else{
        return false;
      }
    }
  }
}
// helper function to get value from input forms
function getInputVal(id){
  return document.getElementById(id).value;
}
//Submit Form
function submitForm(e){
  e.preventDefault();
  // Variables from input fields
  var firstName = getInputVal('first_name');
  var lastName = getInputVal('last_name');
  var email = getInputVal('email').replace(/\s/g, ''); //remove white spaces
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
  var phone = getInputVal('phone');
  var position = getInputVal('position');
  if (position.length == 0){
    postion = getInputVal('other_position');
  }
  var university = getInputVal('university');
  if (university.length == 0){
    university = getInputVal('other_university');
  }
  var phdYear = getInputVal('phd_year');
  var doctoralSchool = getInputVal('doctoral_school');
  if (doctoralSchool.length == 0){
    doctoralSchool = getInputVal('other_doctoral_school');
  }
  var workshop = getInputVal('workshop');

  const participant = {
    contact:{
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone
    },
    professional:{
      position: position,
      university, university,
      phdYear: phdYear,
      doctoralSchool:doctoralSchool
    },
    eventChoices:{
      workshop:workshop
    }
  }

  //save participant
  saveParticipant(participant);

  document.getElementById('submission_msg').style.display = "block";
  document.getElementById('registration_form').reset();
}

// send data to firebase-firestorm and return ID
function saveParticipant(participant){
  var userId = "";
  console.log("hello");
  db.collection('participants').add(participant)
  .then(function(docRef) {
    userId = docRef.id;
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
  return userId;
}

//form helper functions
function showOther(val, id, idOther){
  var main = document.getElementById(id);
  var other = document.getElementById(idOther);
  if(val === 'OTHER'){
    if (other.style.display === "none"){
      main.style.required=false;
      other.style.required = true;
      other.style.display = "block";
    }
  }
  else {
    main.style.required = true;
    other.style.required = false;
    other.style.display = "none";
  }
}
function showPosition(val){
  console.log("In showPosition");
  console.log(val);
  showOther(val, "position", "another_position");
}
function isPhDStudent(val) {
  if(val === 'PhDStudent'){
    $('.phd_student_block').css("display", "flex");
    document.getElementById("university").style.required = true;
    document.getElementById("phd_year").style.required = true;
  }
  else {
    $('.phd_student_block').css("display", "none");
    document.getElementById("university").style.required = false;
    document.getElementById("phd_year").style.required = false;
  } 
  showPosition(val);
}
function showUniversity(val) {
  showOther(val, "university", "another_university");
}
function showSchool(val) {
  showOther(val, "doctoral_school", "another_doctoral_school");
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

var yearAndWorkshops = {};
yearAndWorkshops['YEAR_1'] = ['W.-Stress managemnet & co-working', 'W.-Public speaking' , 'W.-How to structure work and pose the problems'];
yearAndWorkshops['YEAR_2'] = ['W.-Stress managemnet & co-working', 'W.-Public speaking' , 'W.-How to structure work and pose the problems'];
yearAndWorkshops['YEAR_3'] = ['W.-How to get a job in industry after your Ph.D.', 'W.-The transition from graduate student to Professor', 'RT.-Experiences and advices on launching a StartUp','RT.-Gender equality in big companies and public institutions'];
yearAndWorkshops['YEAR_4'] = ['W.-How to get a job in industry after your Ph.D.', 'W.-The transition from graduate student to Professor', 'RT.-Experiences and advices on launching a StartUp','RT.-Gender equality in big companies and public institutions'];
yearAndWorkshops['YEAR_5'] = ['W.-How to get a job in industry after your Ph.D.', 'W.-The transition from graduate student to Professor', 'RT.-Experiences and advices on launching a StartUp','RT.-Gender equality in big companies and public institutions'];

function eraseOptions(select){ // select is the HTML select container
      while (select.options.length) {
      select.remove(0);
    }
}

function changeWorkshopList() {
    /*Retrieve existing lists*/
    var workshopList = document.getElementById("workshop");
    // Master list
    var yearList = document.getElementById("phd_year");
    var phdYear = getInputVal("phd_year");
    // Check position and adapt workshop content accordingly
    var position = getInputVal("position");
    if (position == 'PhDStudent' && phdYear == ""){
      console.log("Erasing");
      eraseOptions(workshopList);
      console.log("Erased");
      workshopList.options.add(new Option("-- Choose your PhD year first --", "", true, false));
      return false;
    }
    else if (position != 'PhDStudent'){
      console.log("not a PhDStudent");
      var currentYear = yearList.options[yearList.length-1].value;
    }
    else{
      var currentYear = yearList.options[yearList.selectedIndex].value;
    }
    // Slave list
    /* Retrive seleted item from master list*/
    // we activate the function to detect if not PhDStudent
    // else we need to wait for user to enter phd_year
    // Clean slave list
    eraseOptions(workshopList);
    /*Retreive corresponding workshop list in function fof the current year*/
    var slotsList = yearAndWorkshops[currentYear];
    // Add workshop list to the corresponding <select> element
    if (slotsList) {
      var i;
      for (i = 0; i < slotsList.length; i++) {
        var slot = new Option(slotsList[i], i);
        workshopList.options.add(slot);
      }
    }
}