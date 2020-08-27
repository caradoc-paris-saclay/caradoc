/* #############################################################################
Javascript for admin page

This file contains:
- imports from forms.js for logging to Firestore (Firebase cloud database)
- functions to collect login & pwd and authetify admins
- helper functions for fetching data from Firestore used in forms

What happens here?
-> when the page loads, the function window.onload is called.
############################################################################# */

import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
// pathname without leading nor trailing "/" 
// eg. turns /admin or /admin/ into admin
const pageName = window.location.pathname.replace(/^\/+/g, '').replace(/\/+$/, ''); 
let provider = new firebase.auth.GoogleAuthProvider();
var admin = firebase.auth();//('firebase-admin');
var participants =  new Array(); // list of participants
var dlwdedCollections = {};
const listCollections = ["participants", "participants_nov_2020", "laboratories"];
//document.getElementById('login_form').addEventListener('submit', window.login);

// window.updateForm 
console.log("firebase:", firebase);
console.log("firebase.app().name:", firebase.app.name);

/* #############################################################################
window.onload
=> called when page is loaded
############################################################################# */
window.onload = function() {
	console.log("window.location.pathname: ", window.location.pathname );
	console.log("pageName: ", pageName);
	initApp();
	if (pageName == "dashboard"){
		updateNumbers();
	}
};
/* #############################################################################
initApp is called only once at window loading time.
However, once called firebase.auth().onAuthStateChanged() will be stay active.
Each time the user logs in / logs out, the code inside its definition will
be executed. 
############################################################################# */
function initApp() {
	console.log("Init App")
      // Listening for auth state changes.
      // [START authstatelistener]
	firebase.auth().onAuthStateChanged(function(user) {
		console.log("Init App onAuthStateChanged");
		if (user) {
			console.log("User signed in")
		  	// Get user data from firebase
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			document.getElementById('logging-status').textContent='Signed in';
			document.getElementById("log-out-btn").disabled = false;
			document.getElementById("log-out-btn").style.visibility = "visible"; 
			// [START_EXCLUDE]
			if (pageName == "admin"){
				window.location.pathname = "/dashboard";
			}
			if (pageName == "dashboard"){
				document.getElementById('dashboard').style.display = "block";
			}
		  // [END_EXCLUDE]
		} 
		else {
			// User is signed out.
			// [START_EXCLUDE]
			if (pageName == "admin"){
				document.getElementById('admin_title').textContent = "Admin Log In Page";
			}
			else if (pageName == "dashboard"){
				document.getElementById('dashboard').style.display = "none";
			}
			// [END_EXCLUDE]
		}
		// [START_EXCLUDE silent]
		if (pageName == "admin"){
			document.getElementById('sign-in').disabled = false;
		}
		// [END_EXCLUDE]
	});
	// [END authstatelistener]
	console.log("Reached end of initApp");
}

window.logout = function logout(){
	firebase.auth().signOut();
	if (pageName == "dashboard"){
		window.location.pathname = "/admin";
	}
}

window.signIn = function signIn() {
	console.log("toggleSignIn triggered");
 	if (firebase.auth().currentUser) {
	    // [START signout]
	    firebase.auth().signOut();
	    // [END signout]
  	} 
  	else {
	    var email = document.getElementById('username').value;
	    var password = document.getElementById('password').value;
	    if (email.length < 4) {
	      alert('Please enter an email address.');
	      return;
	    }
	    if (password.length < 4) {
	      alert('Please enter a password.');
	      return;
		}
	    // Sign in with email and password
	    // [START authwithemail]
	    createSession(email, password);				
	    document.getElementById("login_form").reset();
	    // [END authwithemail]
	}
}

/* #############################################################################
createSession
############################################################################# */
function createSession(email, password){
	console.log("createSession")
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
	.then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(async function(error) {
	      // Handle Errors here.
	      var errorCode = error.code;
	      var errorMessage = error.message;
	      // [START_EXCLUDE]
	      if (errorCode === 'auth/wrong-password') {
	        alert('Wrong password.');
	      } 
	      else {
	        alert(errorMessage);
	      }
	      console.log(error);
	      document.getElementById('sign-in').disabled = false;
      	// [END_EXCLUDE]
    	});;
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

/* #############################################################################
dwldDatabase accesses the databse and download the collection from Firebase
collection is the name of the Firestore collection
the ouput file is in csv format
############################################################################# */

window.dwldDatabase = async function dwldDatabase(collection){
	//console.log(labs.toJSON());
	if(dlwdedCollections[collection] !== undefined){
		return dlwdedCollections[collection];
	}
	else{
		await loadCollection(collection)
		.then( function(snap){
			if (snap != null){
				let snapID = "number_" + collection;
				console.log(snapID);
				document.getElementById(snapID).textContent = snap.size;
				let p;
				dlwdedCollections[collection] = snap;
			}
		})
		.catch(function(error){
			console.log(error);
		});
	}
	
	var csvContent = "data:text/csv;charset=utf-8,"; // csv file
	
		/*snap.forEach(doc => {
	    	p = doc.data();
	    	participants.push(p);  
		})
		// to fill csv
		//csvContent += ;
		var json = participants
		var fields = Object.keys(participants[0])
		var replacer = function(key, value) { return value === null ? '' : value } 
		var csv = json.map(function(row){
		  return fields.map(function(fieldName){
		    return JSON.stringify(row[fieldName], replacer)
		  }).join(',')
		})
		csv.unshift(fields.join(',')) // add header column
		csv = csv.join('\r\n');
		//console.log(csv)
	}
		
	var csvData = new Blob([csv], { type: 'text/csv' }); //new way
	var csvUrl = URL.createObjectURL(csvData);
	var a = document.createElement('a');
	a.href        = csvUrl;
	a.target      = '_blank';
	a.download    = 'export.csv';
	document.getElementById("dashboard").appendChild(a);
	document.getElementById('download_participant').disabled = false;
	document.getElementById('download_participant').addEventListener('click', downloadParticipantCSV, false);
	function downloadParticipantCSV(){
		a.click();*/
}

function loadCollection(collection){
	console.log("Fetching Firestore collection:", collection);
	return new Promise((resolve, reject) => {
		db.collection(collection).get()
		.then(snapshot =>{
			console.log("snapshot", snapshot);
			console.log("snapshot.path", snapshot.path);
			console.log("not empty?", !snapshot.empty);
			console.log("empty?", snapshot.empty);
			try{
				document
			}
			catch(error){
				console.log("Arguments: id", id);
				console.error(error);
			}
			if (!snapshot.empty){
				console.log("Not empty");
				resolve(snapshot);
				console.log("Collection ", collection, " downloaded.");
			}
			else{
				throw "failure";
				reject(null)
			}
		})
		.catch(err =>{
			console.log("Failed to load collection ", collection, ":", err);
			reject(null);
		});
	})
}

function updateNumbers(){
	// code works but will download all the data
	/*console.log("Updating numbers for all collections.");
	listCollections.forEach(async function (collection, index) {
		if(dlwdedCollections[collection] == undefined){
			dlwdedCollections[collection] = await loadCollection(collection);
		}
  		let snapID = "number_" + collection;
		document.getElementById(snapID).textContent = dlwdedCollections[collection].size;
	});*/
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}