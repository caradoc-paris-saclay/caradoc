
import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
var participant=null;
var idRef=null;

function login(){
	var email = document.getElementById("email");
	admin.auth().getUserByEmail(email)
	.then(function(userRecord) {
	// See the UserRecord reference doc for the contents of userRecord.
	console.log('Successfully fetched user data:', userRecord.toJSON());
	})
	.catch(function(error) {
	console.log('Error fetching user data:', error);
});	
}
