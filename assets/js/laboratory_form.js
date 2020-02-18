import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
var participant=null;
var idRef=null;
//Listen to click on submit
document.getElementById('laboratory_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser

const listName = document.getElementById("lab_name_list");
const listAcronym = document.getElementById("lab_acronym_list");
const ls = db.collection('laboratories');
var labs;
setLabs();

async function setLabs(){
	await loadLaboratories()
	.then( function(snap){
		labs = snap;
		if (snap != null){
			let lab;
			labs.forEach(doc => {
		    	lab = doc.data();
		    	console.log(doc.id, '=>', lab);
		    	let optionName = document.createElement('option');
		    	let optionAcronym = document.createElement('option');
		    	optionName.value =  lab.name; 
		    	optionAcronym.value =  lab.acronym;   
		  		listName.appendChild(optionName);
		  		listAcronym.appendChild(optionAcronym);
	  		})
		}
	});
}

function submitForm(e){
	e.preventDefault();
	var firstName = getInputVal('first_name');
	var lastName = getInputVal('last_name');
	var email = getInputVal('email').replace(/\s/g, ''); //remove white spaces
	var phone = getInputVal('phone');
	var name = getInputVal('name');
	var acronym = getInputVal('acronym');
	var isPerson = getInputVal('is_person');

	const newLab = {
	contact:{
	  firstName: firstName,
	  lastName: lastName,
	  email: email,
	  phone: phone,
	  isPerson: isPerson
	},
	name:name,
	acronym:acronym
	}
	saveLab(newLab);
	document.getElementById('submission_msg').style.display = "block";
	document.getElementById('laboratory_form').reset();
}

function updateForm(field, val){
	console.log("Called updateForm");
	console.log(field, " ", val);
}

function isLabInDatabase(newLab){
	let result = false;
	let labId = null;
	let lab;
	labs.forEach(doc => {
		lab = doc.data();
		if (newLab.name == lab.name || newLab.acronym == lab.acronym ){
			console.log("New Lab name: ", newLab.name);
			console.log(newLab);
			console.log("Ols Lab name: ", lab.name);
			console.log(lab);
			labId = doc.id;
			result = true;
		}    	
	})
	return [result, labId];
}

async function addLab(lab){
	let labId = null;
    await ls.add(lab)
    .then(function(docRef) {
    	labId = docRef.id;
    	console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
    	console.error("Error adding document: ", error);
    });
    return labId;
}

function saveLab(lab){
	console.log("Adding new lab:", lab);
	let labId = null;
	//First we check if particpant's e-mail already exsits in the databse
	let check = isLabInDatabase(lab);
	console.log("check", check);
	if (check[0]){
		labId = check[1];
		ls.doc(labId).set(lab)
		.then( doc => {
			console.log("Updating document: ", labId);
		})
		.catch( err => {
			console.error("Error adding document: ", err);
		});
	}
	else{
		console.log("New lab. Creating new database entry");
		labId = addLab(lab);
	}
	return labId;
}
