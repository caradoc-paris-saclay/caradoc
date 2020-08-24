import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
console.log(firebase);
let provider = new firebase.auth.GoogleAuthProvider();
var admin = firebase.auth();//('firebase-admin');
var participants =  new Array(); // list of participants
//document.getElementById('login_form').addEventListener('submit', window.login);

// window.updateForm 
console.log(firebase.app().name);

firebase.auth().onAuthStateChanged(function(user) {

});
/*firebase.auth().getUserByEmail("contact.paris.saclay@gmail.com")
	.then(function(userRecord) {
	// See the UserRecord reference doc for the contents of userRecord.
	console.log('Successfully fetched user data:', userRecord.toJSON());
	})
	.catch(function(error) {
	console.log('Error fetching user data:', error);
});*/	

var f = document.querySelector('#login_form');

function toggleSignIn() {
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
	    // Sign in with email and pass.
	    // [START authwithemail]
	    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
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
	      document.getElementById('quickstart-sign-in').disabled = false;
      	// [END_EXCLUDE]
    	});
	    // [END authwithemail]
	}
  	document.getElementById('quickstart-sign-in').disabled = true;
}

function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
	firebase.auth().onAuthStateChanged(async function(user) {

		if (user) {
		  // User is signed in.
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			// [START_EXCLUDE]
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
			document.getElementById('admin_title').textContent = "Admin Dashboard";
			document.getElementById('admin_subtitle').style.display = "none";
			document.getElementById('quickstart-sign-in').textContent = 'Sign out';
			//document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
			document.getElementById('username_div').style.display = "none";
			document.getElementById('password_div').style.display = "none";
			document.getElementById('dashboard').style.display = "block";
			console.log("Fetching list or Participants.");
			await loadParticipant()
			.then( function(snap){
				//console.log(labs.toJSON());
				var csvContent = "data:text/csv;charset=utf-8,"; // csv file
				if (snap != null){
					document.getElementById("number_participant").textContent = snap.size;
					let p;
					snap.forEach(doc => {
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
				a.click();
			}	
			})
			.catch(function(error){
				console.log(error);
			});
		  // [END_EXCLUDE]
		} 
		else {
			// User is signed out.
			// [START_EXCLUDE]
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
			document.getElementById('admin_title').textContent = "Admin Log In Page";
			document.getElementById('admin_subtitle').style.display = "block";
			document.getElementById('quickstart-sign-in').textContent = 'Sign in';
			//document.getElementById('quickstart-account-details').textContent = 'null';
			document.getElementById('username_div').style.display = "block";
			document.getElementById('password_div').style.display = "block";
			document.getElementById('dashboard').style.display = "none";
			// [END_EXCLUDE]
		}
		// [START_EXCLUDE silent]
		document.getElementById('quickstart-sign-in').disabled = false;
		// [END_EXCLUDE]
	});
	// [END authstatelistener]
	console.log("Reached end of initApp");
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

    console.log("Reached end of initApp");
}



window.onload = function() {
  initApp();
};

window.login = function login(f){
	//var email = document.getElementById("username").value;
	//var password = document.getElementById("password").value;
	var email = f.username.value;
	var password = f.password.value;
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function(stuff){
		console.log("Success? ", stuff);
		//document.getElementById("login_form").style.display = "none";
	})
	.catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;
  	console.console(errorCode);
  	console.alert(error.message);
  	// ...
	});
	return false;
}

function loadParticipant(){
	console.log("Fetching list or participants.");
	return new Promise((resolve, reject) => {
		db.collection("participants").get()
		.then(snapshot =>{
			console.log("not empty?", !snapshot.empty);
			console.log("empty?", snapshot.empty);
			if (!snapshot.empty){
				console.log("Not empty");
				resolve(snapshot);
				console.log("Participants list downloaded.");
			}
			else{
				throw "failure";
				reject(null)
			}
		})
		.catch(err =>{
			console.log("Failed to load list of Participants: ", err);
			reject(null);
		});
	})
}
