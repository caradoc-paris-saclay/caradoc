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
var dlwdedCollections = {};
const listCollections = ["participants", "participants_nov_2020", "laboratories"];
// Counter class
function Counter () {
	var timestamp = null; // timestamp will be initialised later
	this.value = null;
};
function CollectionData () {
	var timestamp = null; // timestamp will be initialised later
	this.data = new Array();
};
var counters = {};
const timeOut = 30 * 60 * 1000; // 30 min in millisecond
//document.getElementById('login_form').addEventListener('submit', window.login);

// window.updateForm 
console.log("firebase:", firebase);
console.log("firebase.app().name:", firebase.app.name);

/* #############################################################################
window.onload
=> called when page is loaded
=> define the default behavior of sign in page
############################################################################# */
window.onload = function() {
	console.log("window.location.pathname: ", window.location.pathname );
	console.log("pageName: ", pageName);
	initApp();
	if (pageName == "dashboard"){
		listCollections.forEach(collection => {
			counters[collection]= new Counter();
			dlwdedCollections[collection] = new CollectionData();	
		});
		Counter.timestamp = Date(); // initialize timestamp of Counter class
		CollectionData.timestamp = Date(); // initialize timestamp of CollectionData class
		updateNumbers();
	}
	else if (pageName == "admin"){
		// we override the default behavior of the form submit action
		var form = document.querySelector('#login_form');
		form.addEventListener('submit', async e => { 
			console.log("Signing In");
			e.preventDefault(); 
			// here we use form.name (i.e. name="username" html attribute)
		    var email = form.username.value; 
		    var password = form.password.value; 
		    console.log(email);
		    if (email.length < 4) {
		      alert('Please enter an email address.');
		      return;
		    }
		    if (password.length < 4) {
		      alert('Please enter a password.');
		      return;
			}
		    // Sign in Firebase with email and password
		    // Password prompt are activated by respecting 
		    // the chain of events managed by createSession
		    await createSession(email, password, e);
			return false;
		});
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
		// see Firebase doc to explore user attributes
		if (user) {
			// User is signed in.
			document.getElementById('logging-status').textContent='Signed in';
			document.getElementById("log-out-btn").disabled = false;
			document.getElementById("log-out-btn").style.visibility = "visible"; 
			if (pageName == "dashboard"){
				document.getElementById('dashboard').style.display = "block";
			}
		} 
		else {
			// User is signed out.
			if (pageName == "admin"){
				document.getElementById('admin_title').textContent = "Admin Log In Page";
				document.getElementById("log-out-btn").disabled = true;
				document.getElementById("log-out-btn").style.visibility = "hidden"; 
				document.getElementById("login_form").reset(); 
			}
			else if (pageName == "dashboard"){
				document.getElementById('dashboard').style.display = "none";
			}
		}
		if (pageName == "admin"){
			document.getElementById('sign-in').disabled = false;
		}
	});
	console.log("End of initApp");
}

/* #############################################################################
logout
winwow.functionName is for accessing functionName with htmn onclik
############################################################################# */
window.logout = function logout(){
	firebase.auth().signOut();
	if (pageName == "dashboard"){
		window.location.pathname = "/admin";
	}
}

/* #############################################################################
createSession
############################################################################# */
function createSession(email, password, e){
	console.log("createSession")
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
	.then(function() {
		console.log("Firebase signIn.")
	    // Existing and future Auth states are now persisted in the current
	    // session only. Closing the window would clear any existing state even
	    // if a user forgets to sign out.
	    // 
	    // New sign-in will be persisted with session persistence.
	    // return below is optional could be deleted (IMO)
	    // signInWithEmailAndPassword query Firebase server to know if
	    // user(email, password) is authorized
	    // authorizations on set on via the Firebase Console
    	return firebase.auth().signInWithEmailAndPassword(email, password)
    	.then(profile => {
    		// Here we propose to the web browser to save the resutls
    		if (window.PasswordCredential) {
		   		var c = navigator.credentials.create({password: e.target});
		   		return navigator.credentials.store(c);
			} 
			else {
			 	return Promise.resolve(profile);
			}
		})
		.then(profile => {
			// we redirect to dashboard after the browser had time to save the credentials
			// this will only work if user succeeded to log ing
			window.location.pathname = "/dashboard";
		})
    	.catch(async function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} 
			else {
				alert(errorMessage);
			}
			console.log(error);
    	});
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

/* #############################################################################
dwldDatabase calls loadCollection to retreive data from Firebase
ARGUMENT "collection" is the name of the Firestore collection
OUTPUT file is in csv format

Remark about accessing data:

At the same time, since we spend "reads" for getting the data, we update the numbers.

It is important to know that Firebase allows only a certain amount of reads / day for free.
Each query counts for 1 read and each document dowloaded counts for 1 read.
=> If you query a collection containing 100 documents, it will be counted as 100 reads
=> Since there is no way to know the size of a collection, we use a special class called
"counters" which countains counters that track the number of elements in collections.
This way we only pay for 1 read to know the number of documents in each collections.
NB: the function actuallizing the counters is a Firebase Cloud Function => see Firebase folder
############################################################################# */

window.dwldDatabase = async function dwldDatabase(collection){
	//console.log(labs.toJSON());
	if(dlwdedCollections[collection] !== undefined  && (Date() - CollectionData.timestamp) < timeOut ){
		return dlwdedCollections[collection];
	}
	else{
		await loadCollection(collection)
		.then(function(snap){
			if (snap != null){
				CollectionData.timestamp = Date();
				let spanId = "number_" + collection;
				document.getElementById(spanId).textContent = snap.size;
				dlwdedCollections[collection].data = new Array(); // empty arrays
				// fill array
				let p;
				snap.forEach(doc => {
			    	p = doc.data();
			    	dlwdedCollections[collection].data.push(p);  
				});
			}
		})
		.catch(function(error){
			console.log(error);
		});
		// convert data to json
		var json = dlwdedCollections[collection].data;
		var fields = Object.keys(dlwdedCollections[collection].data[0]);
		// replace null values by empty string
		var replacer = function(key, value) { return value === null ? '' : value };
		var csv = json.map(function(row){
			return fields.map(function(fieldName){
				return JSON.stringify(row[fieldName], replacer)
				}).join(',');
		});
		csv.unshift(fields.join(',')) // add header column
		csv = csv.join('\r\n'); // add lineskip ath the bottom
		// ready data for download
		var csvData = new Blob([csv], { type: 'text/csv' }); //new way
		var csvUrl = URL.createObjectURL(csvData);
		var a = document.createElement('a');
		a.href        = csvUrl;
		a.target      = '_blank';
		a.download    = collection + '.csv';
		document.getElementById("dashboard").appendChild(a);
		document.getElementById('download_' + collection).disabled = false;
		a.click();
	}
}
/* #############################################################################
loadCollection accesses the database and downloads the collection from Firebase
argument "collection" is the name of the Firestore collection
############################################################################# */

function loadCollection(collection){
	console.log("Fetching Firestore collection:", collection);
	return new Promise((resolve, reject) => {
		db.collection(collection).get()
		.then(snapshot =>{
			console.log("snapshot", snapshot);
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

/* #############################################################################
loadCounters accesses the database and downloads the "counters" collection from Firebase
it is used to update the numbers of documents per collection displayed on the dashboard
############################################################################# */
async function loadCounters(){

	console.log("Fetching counters from Firestore")
	return new Promise((resolve, reject) => {
		db.collection("counters").doc("counters").get()
		.then(snapshot =>{
			console.log("snapshot", snapshot);
			console.log("snapshot.path", snapshot.path);
			if (!snapshot.empty){
				console.log("Counter snapshot is not empty");
				resolve(snapshot);
				console.log("Counters downloaded.");
			}
			else{
				throw "failure";
				reject(null)
			}
		})
		.catch(err =>{
			console.log("Failed to load counters:", err);
			reject(null);
		});
	})

}

/* #############################################################################
updates the numbers of documents per collection displayed on the dashboard
use loadCounters for retreiving data from Firestore.
############################################################################# */
async function updateNumbers(){
	console.log("Updating page numbers.")
	// Create a reference to the cities collection
	let flag = false;
	listCollections.some(collection => {
		let spanId = "number_" + collection;
		let spinnerId = "spinner_" + collection;
		document.getElementById(spanId).textContent = "Loading...";
		document.getElementById(spinnerId).classList.add("spinner-border");
		// for the 1st run, the variables are initialized at null => flag will be true
		if(counters[collection].value == null){
			flag = true;
			return flag; // return from the local function "some" not from updateNumbers
			// we use some instead of ForEach in order to "break" the loop with the return
		}
	});
	if (flag || (Date() - Counter.timestamp) < timeOut ){
		console.log("Here 1")
		const object = await loadCounters();
		const data = object.data();
		listCollections.forEach(collection => {
			counters[collection].value = data[collection];
		});
		Counter.timestamp = Date(); // update timestamp of Counter class
	}
	listCollections.forEach(async function (collection, index) {
		let spanId = "number_" + collection;
		let spinnerId = "spinner_" + collection;
		document.getElementById(spinnerId).classList.remove("spinner-border");
		document.getElementById(spanId).textContent = counters[collection].value;
	});

}