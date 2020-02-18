import { db, getInputVal, setInputVal, loadLaboratories } from  './form.js'; 
var participant=null;
var idRef=null;
//Listen to click on submit
document.getElementById('laboratory_form').addEventListener('submit', submitForm);
//Uncomment this block then use the URL on 2nd line in the webrowser

const listName = document.getElementById("lab_name_list");
const listAcronym = document.getElementById("lab_acronym_list");
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

   const newLab = {
    contact:{
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone
    },
    name:name,
    acronym:acronym
	}
}
