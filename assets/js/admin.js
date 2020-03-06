import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
console.log(firebase);
let provider = new firebase.auth.GoogleAuthProvider();
var admin = firebase.auth();//('firebase-admin');
var participant=null;
var idRef=null;
document.getElementById('admin_form').addEventListener('submit', login);

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

function login(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
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
}
