import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
var participant=null;
var idRef=null;
//Listen to click on submit
document.getElementById('laboratory_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser

var listName = document.getElementById("lab_name_list");
var listAcronym = document.getElementById("lab_acronym_list");
const ls = db.collection('laboratories');
var labs;
var listOfLabs = new Array();
setLabs();

async function setLabs(){
	await loadLaboratories()
	.then( function(snap){
		labs = snap;
		console.log("snap: ", snap);
		//console.log(labs.toJSON());
		if (snap != null){
			let lab;
			labs.forEach(doc => {
		    	lab = doc.data();
		    	listOfLabs.push(lab);
		    	//console.log(doc.id, '=>', lab);
		    	let optionName = document.createElement('option');
		    	let optionAcronym = document.createElement('option');
		    	optionName.value =  lab.name; 
		    	optionName.id = lab.name.replace(/\s/g, '');
		    	optionAcronym.value =  lab.acronym; 
		    	optionAcronym.id =  lab.acronym.replace(/\s/g, '');     
		  		listName.appendChild(optionName);
		  		listAcronym.appendChild(optionAcronym);
	  		})
		}
		makeLabTable();
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
	var isPerson = getInputVal('is_person')  == "true" ? true : false;

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
	listOfLabs.push(newLab);
	addLabToTable(newLab, -1);
	document.getElementById('submission_msg').style.display = "block";
	document.getElementById('laboratory_form').reset();
	// Fetch contact information from database
	loadLaboratories();
}

// since we use this js as a module we need to declare the
// function using window.functioname to use in the html file
window.updateForm = function updateForm(field, val){
	let flag = false;
	let lab;
	let reflab;
	if (field == 'acronym'){
		labs.forEach(doc => {
			lab = doc.data();
			if (val == lab.acronym){
				reflab = lab;
				setInputVal('name', reflab.name);
				clearContactField();
				flag = true;
				return true;
			}  
		})
	}
	else if (field == 'name'){
		labs.forEach(doc => {
			lab = doc.data();
			if (val == lab.name){
				reflab = lab;
				setInputVal('acronym', reflab.acronym);
				clearContactField();
				flag = true;
				return true;
			}  
		})
	}
	//console.log(lab);
	if (flag){
		setInputVal('first_name', reflab.contact.firstName);
		setInputVal('last_name', reflab.contact.lastName);
		setInputVal('email', reflab.contact.email)
		setInputVal('phone', reflab.contact.phone);
		setInputVal('is_person', reflab.contact.isPerson);
	}
}

function clearContactField(){
	setInputVal('first_name', "");
	setInputVal('last_name', "");
	setInputVal('email', "")
	setInputVal('phone', "");
	setInputVal('is_person', "");
}

function isLabInDatabase(newLab, refresh){
	let result = false;
	let labId = null;
	let lab;
	labs.forEach(doc => {
		lab = doc.data();
		if (newLab.name == lab.name || newLab.acronym == lab.acronym ){
			//console.log("New Lab name: ", newLab.name);
			//console.log(newLab);
			//console.log("Old Lab name: ", lab.name);
			//console.log(lab);
			labId = doc.id;
			result = true;
			if (refresh){
				listName.removeChild(document.querySelector("#lab_name_list option[value=\""+lab.name+"\"]"));
				listAcronym.removeChild(document.querySelector("#lab_acronym_list option[value=\""+lab.acronym+"\"]"));
				let optionName = document.createElement('option');
		    	let optionAcronym = document.createElement('option');
		    	optionName.value =  newLab.name; 
		    	optionName.id = newLab.name.replace(/\s/g, '');
		    	optionAcronym.value =  newLab.acronym; 
		    	optionAcronym.id =  newLab.acronym.replace(/\s/g, '');
		  		listName.appendChild(optionName);
		  		listAcronym.appendChild(optionAcronym);
			}
			return [result, labId]; // to break the loop sooner
		}    	
	});
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
	let check = isLabInDatabase(lab, true);
	//console.log("check", check);
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


function addLabToTable(lab, row){
	var table = document.getElementById("table_labs");

	var row, acronym, name, firstName, lastName, email, phone, isPerson;
	row = table.insertRow(row);

	acronym = row.insertCell(0);
	name = row.insertCell(1);
	firstName = row.insertCell(2);
	lastName = row.insertCell(3);
	email = row.insertCell(4);
	phone = row.insertCell(5);
	isPerson = row.insertCell(6);

	acronym.innerHTML = lab.acronym;
	name.innerHTML = lab.name;
	firstName.innerHTML = lab.contact.firstName;
	lastName.innerHTML = lab.contact.lastName;
	email.innerHTML = lab.contact.email;
	phone.innerHTML = lab.contact.phone;
	isPerson.innerHTML = lab.contact.isPerson;

	updateNumberLabs();
}

function updateNumberLabs(){
	document.getElementById("label_list_labs").innerHTML = "List of Labs (" + listOfLabs.length +")";
}

function makeLabTable(){
	var table = document.getElementById("table_labs");
	listOfLabs.sort(function(a, b){ 
		var x = a.acronym.toLowerCase();
	  	var y = b.acronym.toLowerCase();
	  	if (x < y) {return -1;}
	  	if (x > y) {return 1;}
	  	return 0;
	});

	var row, acronym, name, firstName, lastName, email, phone, isPerson;
	updateNumberLabs();
	listOfLabs.forEach(function(lab, i){
		row = table.insertRow(-1);

		acronym = row.insertCell(0);
		name = row.insertCell(1);
		firstName = row.insertCell(2);
		lastName = row.insertCell(3);
		email = row.insertCell(4);
		phone = row.insertCell(5);
		isPerson = row.insertCell(6);

		acronym.innerHTML = lab.acronym;
		name.innerHTML = lab.name;
		firstName.innerHTML = lab.contact.firstName;
		lastName.innerHTML = lab.contact.lastName;
		email.innerHTML = lab.contact.email;
		if (lab.contact.email == ""){
			console.log("Problem: email missing!");
			row.className = "table-danger";
		}
		phone.innerHTML = lab.contact.phone;
		isPerson.innerHTML = lab.contact.isPerson;
	});
}