//old version
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
	              getEmail(profile, participant.contact.emailId).get().then(function(subDoc){
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
        	subCollectionID = doc.data().contact.emailId;
        	console.log("subCollectionID", subCollectionID);
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
		//console.log(tmp);
	});
	it("Add new participant if e-mail not already in collection",  async () => {
		var oldParticipant = makeParticipant("lol@gmail.com"); 
		await addParticipant(oldParticipant);
		var newParticipant = makeParticipant("pablo@gmail.com");
		//var idRef = newParticipant.contact.emailId;
		var idRef = oldParticipant.contact.emailId;
		console.log("Starting Lookup");
		//firebase.firestore.FieldPath.documentId()
		/*await db.collection("email").doc(idRef).get()
		.then(function(doc){
			//console.log(doc.data());
			if (doc.exists){
				console.log("Found the subcollection email: ", doc.data());
			}
			else{
				console.log("Couldn't find the subCollection email.");
			}*/
		await db.collectionGroup("email")
		.where("emailId", "==", idRef).get()
		.then(snapshot => {
		    	snapshot.forEach(doc => {
		      		console.log(doc.id, '=>', doc.data());
		    	});
		});
		await firebase.assertSucceeds(
			await addParticipant(makeParticipant("pablo@gmail.com"))
		);
	});
	it("Try to get all emails", async () => {
		await addParticipant(makeParticipant("ref@gmail.com"));
		idRef = await addParticipant(makeParticipant("lol@gmail.com"));
		await firebase.assertSucceeds(
			es.get()
			.then(snapshot => {
		    	snapshot.forEach(doc => {
		      		console.log(doc.id, '=>', doc.data());
		    	});
		  })
		  .catch(err => {
		    console.log('Error getting documents', err);
		  })
			//ps.where("refgmailcom", "==", "").get()
		);
	});
	/*it("Refuse new participant if e-mail already in collection", async () => {
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
	/*it("Read non exsisting id e-mail already in collection", async () => {
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