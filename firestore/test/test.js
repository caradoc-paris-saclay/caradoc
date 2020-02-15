const firebase = require("@firebase/testing");
const fs = require("fs");
const projectId = "caradoc-b9cfd";
const firebasePort = require("../firebase.json").emulators.firestore.port;
const port = firebasePort ? firebasePort : 8080;
const rules = fs.readFileSync("firestore.rules", "utf8");

var firebaseConfig = {
  apiKey: "AIzaSyCEMl2rBQqmY5YzqKGfYLy0VgLug7HQZ7o",
  authDomain: "caradoc-b9cfd.firebaseapp.com",
  databaseURL: "https://caradoc-b9cfd.firebaseio.com",
  projectId: "caradoc-b9cfd",
  storageBucket: "caradoc-b9cfd.appspot.com",
  messagingSenderId: "1013854021090",
  appId: "1:1013854021090:web:5268ed8763c40c9f1b45bb"
};
function authedApp(auth) {
    return firebase.initializeTestApp({ projectId, auth }).firestore();
}
function generalAuthApp(){
	return firebase.initializeTestApp(firebaseConfig).firestore();
}

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
});
before(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
});
after(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
});

function makeParticipant(newemail){
	var tmp = newemail.replace("@","").replace(/\./g,""); 
	return {
	contact:{
	  firstName: "A",
	  lastName: "G",
	  email: newemail,
	  emailS: tmp,
	  phone: ""
	},
	professional:{
	  position: "PostDocs",
	  university: "",
	  phdYear: "",
	  doctoralSchool:"doctoralSchool"
	},
	eventChoices:{
	  workshopIndex:"0",
	  workshop:"W4. - ..."
	}
  }
}

describe("TEST SUITE WRITE/READ EMAIL", () => {
	const db = authedApp(null);//generalAuthApp();
	const ps = db.collection("participants");
	var idRef;
	var idRef2;
	var userId;
	async function getMarker() {
    	const snapshot = await ps.get();
    	return snapshot.docs.map(doc => doc.id);
	}
	async function addParticipant(participant){
		let id;
    	await ps.add(participant)
	      .then(function(docRef) {
	      	id = docRef.id;
	      	console.log("Document written with ID: ", id);
		    docRef.collection("email").doc(participant.contact.emailS).set({});
		    //console.log(docRef.data());
		  })
	  	.catch(function(error) {
	    	console.error("Error adding document: ", error);
	  	});
	  	//await ps.doc(id).collection("email").add({participant.contact.email:""});
	  	return id;
	}
	async function addParticipantWithSubCol(participant){
		let id;
		var batch = db.batch();

		batch.set(ps, participant);
		
	}
	function getEmail(topDoc, emailID){
		return topDoc.collection("email").doc(emailID);
	}
	it("Add a new participant", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
        await firebase.assertSucceeds(
        	await addParticipant(makeParticipant("lol@gmail.com"))
        );
	});
	it("Using ID to retreive document", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		console.log(idRef);
        const profile = ps.doc(idRef);
        var participant;
        await firebase.assertSucceeds(
        	await profile.get().then(function(doc){
	            if (doc.exists){
	              participant = doc.data();
	              getEmail(profile, participant.contact.emailS).get().then(function(subDoc){
	              	console.log("Reading subcollection data : ", subDoc.data());
	              });
	        	  console.log("Doc found. Participant's email: ", participant.contact.email);
	        	  console.log("Keys: ", Object.keys(participant));
	        	  const cmpr = 'lolgmailcom';
	        	  console.log("Is ", cmpr, " in keys? ",  cmpr in participant);
	        	  console.log(participant);
	            }
            })
        );
	});
	it("Acess subCollection Email", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		console.log(idRef);
		var subCollectionID;
        const profile = ps.doc(idRef);
        await profile.get().then(function(doc){
        	subCollectionID = doc.data().contact.emailS;
        });
        
        await firebase.assertSucceeds(
        	await profile.collection("email").doc(subCollectionID).get()
        	.then(function(doc){
	            if (doc.exists){
	              console.log("Subcollection exists!", doc.data());
	          	}
            })
        );
	});
	it("Read all participants", async () => {
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		var tmp="";
		await firebase.assertFails(
			 tmp = getMarker()
		);
		console.log(tmp);
	});
	/*it("Add new participant if e-mail not already in collection",  async () => {
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		await firebase.assertSucceeds(
			await addParticipant(makeParticipant("pablo@gmail.com"))
		);
	});
	it("Refuse new participant if e-mail already in collection", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		await firebase.assertSucceeds(
			ps.doc(idRef).get()
			.then(function(docRef) {
		    	console.log("Document found with ID: ", idRef);
		  	})
		  	.catch(function(error) {
		  		//addParticipant(makeParticipant("lol@gmail.com"))
		    	console.error("Error adding document: ", error);
		  	})
			//ps.where("refgmailcom", "==", "").get()
		);
	});
	it("Read non exsisting id e-mail already in collection", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		await firebase.assertSucceeds(
			ps.doc("some@gmail.com").get()
			.then(function(docRef) {
		    	console.log("Document found with ID: ", idRef);
		  	})
		  	.catch(function(error) {
		  		//addParticipant(makeParticipant("lol@gmail.com"))
		    	console.error("Error adding document: ", error);
		  	})
			//ps.where("refgmailcom", "==", "").get()
		);
	});*/
});