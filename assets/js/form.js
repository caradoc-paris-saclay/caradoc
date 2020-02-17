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
export const db = firebase.firestore();

// helper function to get value from input forms
export function getInputVal(id){
  return document.getElementById(id).value;
}
export function setInputVal(id, val){
  document.getElementById(id).value = val;
}

export function loadLaboratories(){
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