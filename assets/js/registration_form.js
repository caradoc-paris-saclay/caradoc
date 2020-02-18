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

// helper function to get value from input forms
function getInputVal(id){
  return document.getElementById(id).value;
}
function setInputVal(id, val){
  document.getElementById(id).value = val;
}

function loadLaboratories(){
  console.log("Fetching list or laboratories.");
  return new Promise((resolve, reject) => {
    db.collection("laboratories").get()
    .then(snapshot =>{
      console.log("not empty?", !snapshot.empty);
      console.log("empty?", snapshot.empty);
      if (!snapshot.empty){
        console.log("Not empty");
        resolve(snapshot);
        console.log("Laboratory list downloaded.");
      }
      else{
        throw "failure";
        reject(null)
      }
    })
    .catch(err =>{
      console.log("Failed to load list of laboratories: ", err);
      reject(null);
    });
  })
}
// workshop
var yearAndWorkshops = {};
yearAndWorkshops['YEAR_1'] = ['W1-Stress managemnet & co-working', 'W2-Public speaking' , 'W3-How to structure work and pose the problems'];
yearAndWorkshops['YEAR_2'] = ['W1-Stress managemnet & co-working', 'W2-Public speaking' , 'W3-How to structure work and pose the problems'];
yearAndWorkshops['YEAR_3'] = ['W4-How to get a job in industry after your Ph.D.', 'W5-The transition from graduate student to Professor', 'RT1-Experiences and advices on launching a StartUp','RT2-Gender equality in big companies and public institutions'];
yearAndWorkshops['YEAR_4'] = ['W4-How to get a job in industry after your Ph.D.', 'W5-The transition from graduate student to Professor', 'RT1-Experiences and advices on launching a StartUp','RT2-Gender equality in big companies and public institutions'];
yearAndWorkshops['YEAR_5'] = ['W4-How to get a job in industry after your Ph.D.', 'W5-The transition from graduate student to Professor', 'RT1-Experiences and advices on launching a StartUp','RT2-Gender equality in big companies and public institutions'];
const positionArray=["PhDStudent", "PostDoc", "AssistantProfessor", "Professor"];
// Your web app's Firebase configuration
var yearList = document.getElementById("phd_year");

var participant=null;
var idRef=null;
//Listen to click on submit
document.getElementById('registration_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser

//const labs = loadLaboratories();
processUser();

//http://127.0.0.1:4000/reg_form_test_arnaud.html/?firstname=Arnaud&lastname=Jean
//Function to get data from URL and load content from firebase-firestore db when existing
// TODO
function processUser(){
  console.log("Parsing URL:");
  var parameters = location.search.substring(1).split("&");
  // check if array and if array is empty
  if (Array.isArray(parameters) && parameters.length){
    if (parameters[0] != ""){
      var temp = parameters[0].split("=");
      if (temp[0] === "id"){
         idRef = decodeURI(temp[1])
         console.log("id: ", idRef);
          db.collection("participants").doc(idRef).get()
          .then(function(doc){
            if (doc.exists){
              participant = doc.data();
                // Variables from input fields
              setInputVal('first_name', participant.contact.firstName);
              setInputVal('last_name', participant.contact.lastName);
              setInputVal('email', participant.contact.email);
              setInputVal('email_confirmation', participant.contact.email);
              setInputVal('phone', participant.contact.phone);
              //todo treat case of display and others
              //setInputVal('postion', participant.professional.position);
              console.log(participant.professional.position);
              showPosition(participant.professional.position);
              isPhDStudent(participant.professional.position);
              setInputVal('university', participant.professional.university);
              showUniversity(participant.professional.university);
              setInputVal('phd_year', participant.professional.phdYear);
              setInputVal('doctoral_school', participant.professional.doctoralSchool);
              if(positionArray.includes(participant.professional.position)){
                setInputVal('laboratory', participant.professional.workplace);
              }
              else{
                setInputVal('other_position_institution', participant.professional.workplace);
              }
              showSchool(participant.professional.doctoralSchool);
              changeWorkshopList();
              setInputVal('workshop', participant.eventChoices.workshopIndex);
              setInputVal('poster', participant.eventChoices.poster);
            }
          });
      }
      else{
        return false;
      }
    }
  }
}

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
  var phone = getInputVal('phone');
  var position = getInputVal('position');
  var workplace="";
  if (position.length == 0){
    postion = getInputVal('other_position');
    workplace = getInputVal('other_position_institution');
  }
  else{
    var workplace = getInputVal('laboratory');
  }
  console.log("workplace", workplace);
  var university = getInputVal('university');
  if (university.length == 0){
    university = getInputVal('other_university');
  }
  var phdYear = getInputVal('phd_year');
  var doctoralSchool = getInputVal('doctoral_school');
  if (doctoralSchool.length == 0){
    doctoralSchool = getInputVal('other_doctoral_school');
  }
  var workshopIndex = getInputVal('workshop'); // returns an int
  if(position != 'PhDStudent'){
    var workshop = yearAndWorkshops['YEAR_5'][workshopIndex];
  }
  else{
    var workshop = yearAndWorkshops[phdYear][workshopIndex];
  }
  var poster = getInputVal('poster') == "true" ? true : false;

  const newParticipant = {
    contact:{
      firstName: firstName,
      lastName: lastName,
      email: email,
      emailId: emailId,
      phone: phone
    },
    professional:{
      position: position,
      university: university,
      phdYear: phdYear,
      doctoralSchool: doctoralSchool,
      workplace: workplace
    },
    eventChoices:{
      workshopIndex: workshopIndex,
      workshop: workshop,
      poster: poster
    }
  }

  //save participant
  // check if id was provided and we are just updating an already existing participant
  // check if e-mail already exist to prevent making double entry for same e-mail
  saveParticipant(newParticipant);
  document.getElementById('submission_msg').style.display = "block";
  document.getElementById('registration_form').reset();
}

// send data to firebase-firestorm and return ID
function saveParticipant(participant){
  console.log(participant);
  let userId = null;
  let ps = db.collection('participants');
  let es = db.collection('email');
  //First we check if particpant's e-mail already exsits in the databse
  es.doc(participant.contact.emailId).get()
  .then(function(doc) {
    if (doc.exists){
      console.log("Found user in database, update user info");
      ps.doc(doc.data().refId).update(participant);
    }
    else{
    }})
  .catch(function(error) {
    //console.error("Error getting document: ", error);
    console.log("New user. Creating new database entry");
      async function addPar(){
        await ps.add(participant)
        .then(function(docRef) {
          userId = docRef.id;
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
        es.doc(participant.contact.emailId).set({
          refId:userId
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
      addPar();
      
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
      if (other.value != val){
        other.value = val; // for when we load data from firebase
      }
      other.style.required = true;
      other.style.display = "block";
    }
  }
  else {
    main.style.required = true;
    if (main.value != val){
      main.value = val;
    }
    other.style.required = false;
    other.style.display = "none";
  }
}
function showPosition(val){
  showOther(val, "position", "another_position");
}
function isPhDStudent(val) {
  if(val === 'PhDStudent'){
    $('.postdoc_block').css("display", "none");
    $('.professor_block').css("display", "none");
    $('.phd_student_block').css("display", "flex");
    document.getElementById("university").style.required = true;
    document.getElementById("phd_year").style.required = true;
    document.getElementById("laboratory").style.required = true;
  }
  else if (val === 'PostDoc'){
    $('.phd_student_block').css("display", "none");
    $('.professor_block').css("display", "none");
    $('.postdoc_block').css("display", "flex");
    document.getElementById("laboratory").style.required = true;
  }
  else if (val === 'Professor' || val === 'AssistantProfessor'){
    $('.phd_student_block').css("display", "none");
    $('.postdoc_block').css("display", "none");
    $('.professor_block').css("display", "flex");
    document.getElementById("laboratory").style.required = true;
  }
  else {
    console.log("We are here fo OTHERs");
    $('.phd_student_block').css("display", "none");
    $('.postdoc_block').css("display", "none");
    document.getElementById("university").style.required = false;
    document.getElementById("laboratory").style.required = false;
    document.getElementById("phd_year").style.required = false;
  }
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

function eraseOptions(select){ // select is the HTML select container
      while (select.options.length) {
      select.remove(0);
    }
}

function changeWorkshopList() {
    /*Retrieve existing lists*/
    var workshopList = document.getElementById("workshop");
    // Master list
    var phdYear = getInputVal("phd_year");
    // Check position and adapt workshop content accordingly
    var position = getInputVal("position");
    if (position == 'PhDStudent' && phdYear == ""){
      eraseOptions(workshopList);
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
