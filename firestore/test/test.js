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
	  emailId: tmp,
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
	const es = db.collection("email");
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
	      	console.log("Document written with ID: ", id)
		    //console.log(docRef.data());
		  })
	  	.catch(function(error) {
	    	console.error("Error adding document: ", error);
	  	});
	  	await es.doc(participant.contact.emailId).set({
	  		refId:id
	  	})
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
	              es.doc(participant.contact.emailId).get()
	              .then(function(doc){
	              	console.log("Doc found. Participant's email: ", participant.contact.email);
	              })
	              .catch(function (err){
	              	console.log(err);
	              });
	              
	        	  console.log(participant);
	            }
            })
        );
	});
	it("Acess collection Email", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		console.log(idRef);
		var subCollectionID;
        const profile = ps.doc(idRef);
        await profile.get().then(function(doc){
        	emailId = doc.data().contact.emailId;
        	console.log("subCollectionID", emailId);
        });
        
        await firebase.assertSucceeds(
        	await es.doc(emailId).get()
        	.then(function(doc){
	            if (doc.exists){
	              console.log("Subcollection exists! ", doc.data());
	          	}
            })
        );
	});
	it("Knowing e-mail get particpant info", async () => {
		let participant = makeParticipant("ref@gmail.com")
		await addParticipant(participant);
		let emailId = participant.contact.emailId;
		var participantId;
	    await es.doc(emailId).get()
    	.then(function(doc){
            if (doc.exists){
              participantId = doc.data().refId;
              console.log("Email exists! ", doc.data());
          	}
        });
	    const profile = ps.doc(participantId);
	    await firebase.assertSucceeds(
    		await profile.get().then(function(doc){
    			if (doc.exists){
    				console.log("Found participant", doc.data());
    			}
    			else{
    				console.log("Couldn't find participant");
    			}
	    	})
        );
	});
	it("Try reading all participants", async () => {
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		var tmp="";
		await firebase.assertFails(
			 tmp = getMarker()
		);
		//console.log(tmp);
	});
	it("Add new participant only if e-mail not already in collection",  async () => {
		var oldParticipant = makeParticipant("lol@gmail.com"); 
		await addParticipant(oldParticipant);
		var emailId = oldParticipant.contact.emailId;
		var newParticipant = makeParticipant("pablo@gmail.com");
		console.log("Starting Lookup");
		let participantId;
		await es.doc(emailId).get()
		.then(function(doc){
			if (doc.exists){
				participantId = doc.data().refId;
				console.log("Found the email: ", doc.data());
			}
			else{
				console.log("Couldn't find the email.");
			}
		});
		await firebase.assertSucceeds(
			ps.doc(participantId).get()
			.then(doc => {
				if(doc.exists){
		    	console.log("Found participant");
	      		console.log(doc.id, '=>', doc.data());
	      	}
	      	else{
	      		console.log("Access granted. Yet found nothing");
	      	}
		  })
		  .catch(err => {
		    console.log('Error getting documents', err);
		  })
			//ps.where("refgmailcom", "==", "").get()
		);
	});
});