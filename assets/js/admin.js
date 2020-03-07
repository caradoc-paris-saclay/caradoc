import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
console.log(firebase);
let provider = new firebase.auth.GoogleAuthProvider();
var admin = firebase.auth();//('firebase-admin');
var participant=null;
var idRef=null;
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
	firebase.auth().onAuthStateChanged(function(user) {

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
			document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
			document.getElementById('username_div').style.display = "none";
			document.getElementById('password_div').style.display = "none";
		  // [END_EXCLUDE]
		} 
		else {
			// User is signed out.
			// [START_EXCLUDE]
			document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
			document.getElementById('admin_title').textContent = "Admin Log In Page";
			document.getElementById('admin_subtitle').style.display = "block";
			document.getElementById('quickstart-sign-in').textContent = 'Sign in';
			document.getElementById('quickstart-account-details').textContent = 'null';
			document.getElementById('username_div').style.display = "block";
			document.getElementById('password_div').style.display = "block";
			// [END_EXCLUDE]
		}
		// [START_EXCLUDE silent]
		document.getElementById('quickstart-sign-in').disabled = false;
		// [END_EXCLUDE]
	});
	// [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
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
