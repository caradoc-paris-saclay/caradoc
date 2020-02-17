var firebaseConfig = {
  apiKey: "AIzaSyCEMl2rBQqmY5YzqKGfYLy0VgLug7HQZ7o",
  authDomain: "caradoc-b9cfd.firebaseapp.com",
  databaseURL: "https://caradoc-b9cfd.firebaseio.com",
  projectId: "caradoc-b9cfd",
  storageBucket: "caradoc-b9cfd.appspot.com",
  messagingSenderId: "1013854021090",
  appId: "1:1013854021090:web:5268ed8763c40c9f1b45bb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var participant=null;
var idRef=null;
//Listen to click on submit
document.getElementById('laboratory_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser

loadLabs();
const list = document.getElementById("labs_list");


function loadLabs(){
  console.log("Fetching lab list");
  db.collection("laboratories").get()
  .then(snapshot =>{
    console.log("Laboratory list downloaded.");
    let entry;
    snapshot.forEach(doc => {
    	lab = doc.data();
    	console.log(doc.id, '=>', lab);
    	let option = document.createElement('option');
    	option.value = (lab.acronym != "") ? (lab.acronym + " -- " + lab.name) : lab.name  ;   
  		list.appendChild(option);
  		
	});
  })
  .catch(err =>{
    console.log("Failes to load list of labs: ", err);
  });
}

function submitForm(e){
  e.preventDefault();
}
