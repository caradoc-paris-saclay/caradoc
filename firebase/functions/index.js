/* #############################################################################
Functions used as Firebase Clound Functions.
Functions below are for:
- transactionnal e-mails
- counters of documents in collections

They get triggered when an event is produced by Firebase Firestore

Transactionnal e-mail :
Here we want to send an e-mail to participants when:
1) a participant is added to Firestore (1st registration) 
2) a participant modifies its data on Firestore (modify registration)

The corresponding functions are:
1) sendRegistrationEmail 
2) sendModificationEmail

Counters:
- increment -> add 1 to counters.counters when file is created
- decrement -> subtract 1 to counters.counters when file is deleted

IMPORTANT
-> in order to run the code you need to set the credentials correctly
You need 2 sorts of credentials
1) To send the code to Firebase Cloud Functions
2) For Firebase Cloud Function to use the gmail accound that will send the email

To do so you need to run in a terminal after having `cd` in the folder containing this file:

1) `firebase login`
1 bis) Make sure that you have downloaded the file caradoc-b9cfd-firebase-adminsdk-7xt83-7e9adb6728.json
and that it is present in the same folder as this code.

2) `firebase functions:config:set gmail.email="name@gmail.com" gmail.password="pwd"`
2 bis) In order to use option 2) you need  also to set the corresponding gmail account Security
parameters to allow "Access to less secure apps"

Remark:
It is possible to enforce an authorization scheme that is more secure using OAuth2
for step 2). => TODO + Explanation in the wiki

To deploy the final code run in the terminal:
Either:
 ".\deploy_function.sh" (may need to run `chmod +x  deploy_function.sh` once)
Or equivalently:
`firebase deploy --only functions`
############################################################################# */

'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');
const admin = require('firebase-admin');

var serviceAccount = require("./caradoc-b9cfd-firebase-adminsdk-7xt83-7e9adb6728.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://caradoc-b9cfd.firebaseio.com"
});

const db = admin.firestore();
const counters = db.collection("counters").doc("counters");
/* #############################################################################
 Create and Deploy Your First Cloud Functions
 https://firebase.google.com/docs/functions/write-firebase-functions

 Configure the email transport using the default SMTP transport and a GMail account.
 For other types of transports such as Sendgrid see https://nodemailer.com/transports/
 TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
 async..await is not allowed in global scope, must use a wrapper
############################################################################# */
async function main() {
  //const emailAddress = functions.config().ovh.email;
  //const emailPassword = functions.config().ovh.password;
  const emailAddress = functions.config().gmail.email;
  const emailPassword = functions.config().gmail.password;
  const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: emailAddress, // generated ethereal user
        pass: emailPassword // generated ethereal password
      }
  });
  /* #############################################################################
  sendRegistrationEmail
  Sends an email confirmation when a user registers for the 1st time.
  It correponds to the creation of a document in the collection participants_nov_2020
  Don't forget to change the name of the collection in the functions
  ############################################################################# */
  exports.sendRegistrationEmail = functions
  .region('europe-west1')
  .firestore
      .document('participants_nov_2020/{participantID}')
      .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const participant = snap.data();

        // access a particular field as you would any JS property
        const id = snap.id;
        const firstName = participant.contact.firstName;
        console.log("New doc id: ", id, " and firstname: ", firstName);

        const mailOptions = {
          from: '"No-Reply CARaDOC" <contact@caradoc-paris-saclay.fr>',
          to: participant.contact.email,
        };


    // Building Email message.

    mailOptions.subject = "[Action Required] Welcome to CARaDOC 2020!";
    mailOptions.text = "";
    mailOptions.html = fs.readFileSync("./email_body_register.html")
                         .toString()
                         .replace(/participantID/g, id)
                         .replace(/participantFirstName/g, participant.contact.firstName)
                         .replace(/participantLastName/g, participant.contact.lastName);
    
    try {
      async function test(){await mailTransport.sendMail(mailOptions);}
      test();
      console.log("File ./email_body_register.html exist ? ", fs.existsSync("./email_body_register.html"));
      console.log(`New subscription confirmation email sent to:`, participant.contact.email);
    } catch(error) {
      console.error('There was an error while sending the email:', error);
    }
    return null;
  });

  /* #############################################################################
  sendModificationEmail
  Sends an email confirmation when a user updates data sent for registration
  ############################################################################# */
  exports.sendModificationEmail = functions
  .region('europe-west1')
  .firestore
      .document('participants_nov_2020/{participantID}')
      .onUpdate((change, context) => {
        const participant = change.after.data();
        const participantOld = change.before.data();
        console.log("Looking at id: ", change.after.id);
        if (participant.contact.email != participantOld.contact.email){
          db.collection('email_nov_2020').document(participantOld.contact.emailId).delete()
          .then( function(snap){
              console.log("Old email document deleted.");
              db.collection('email_nov_2020').document(participant.contact.emailId).get()
              .then(function(doc){
                if (doc.exists){
                  console.log("New email doc found.")
                }
                else{
                  consol.log("Couldn't find new email doc. Creating one.")
                  db.collection('email_nov_2020').document(participant.contact.emailId).set({
                      refId:participantID
                  });
                }
              })
              .catch(function (err){
                console.log("Error when trying to find email document: ", participant.contact.emailId);
                console.log("Error report: ", err);
              });
          })
          .catch(function(err){
              console.log("Error when deleting email doc: ", participantOld.contact.emailId);
          });
        }

        // access a particular field as you would any JS property
        const id = change.after.id;
        const firstName = participant.contact.firstName;
        console.log("Modify doc id: ", id);

        const mailOptions = {
          from: '"No-Reply CARaDOC" <contact@caradoc-paris-saclay.fr>',
          to: participant.contact.email,
        };
        mailOptions.subject = "Modifcation of your registration to CARaDOC 2020.";

      mailOptions.text = "";
      mailOptions.html = fs.readFileSync("./email_body_modify.html")
                           .toString()
                           .replace(/participantID/g, id)
                           .replace(/participantFirstName/g, participant.contact.firstName)
                           .replace(/participantLastName/g, participant.contact.lastName);
      
      try {
        async function test(){await mailTransport.sendMail(mailOptions);}
        test();
        console.log("File ./email_body_modify.html exist ? ", fs.existsSync("./email_body_modify.html"));
        console.log(`Modification confirmation email sent to:`, participant.contact.email);
      } catch(error) {
        console.error('There was an error while sending the email:', error);
      }
      return null;
  });
  /* #############################################################################
  incrementParticipantsNov2020
  Add 1 to counter when a document is added to the collection participants_nov_2020
  ############################################################################# */
  exports.incrementParticipantsNov2020 = functions
  .region('europe-west1')
  .firestore
  .document('participants_nov_2020/{participantID}')
  .onCreate((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["participants_nov_2020"];
        console.log("Counter value before update", c);
        c++;
        console.log("Counter value after update", c);
        counters.update({"participants_nov_2020": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });
  /* #############################################################################
  decrementParticipantsNov2020
  Subtract 1 to counter when a document is deleted from the collection participants_nov_2020
  ############################################################################# */
  exports.decrementParticipantsNov2020 = functions
  .region('europe-west1')
  .firestore
  .document('participants_nov_2020/{participantID}')
  .onDelete((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["participants_nov_2020"];
        console.log("Counter value before update", c);
        c--;
        console.log("Counter value after update", c);
        counters.update({"participants_nov_2020": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });
  /* #############################################################################
  incrementParticipants
  Add 1 to counter when a document is added to the collection participants
  ############################################################################# */
  exports.incrementParticipants = functions
  .region('europe-west1')
  .firestore
  .document('participants/{participantID}')
  .onDelete((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["participants"];
        console.log("Counter value before update", c);
        c++;
        console.log("Counter value after update", c);
        counters.update({"participants": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });

  /* #############################################################################
  decrementParticipants
  Subtract 1 to counter when a document is deleted from the collection participants
  ############################################################################# */
  exports.decrementParticipants = functions
  .region('europe-west1')
  .firestore
  .document('participants/{participantID}')
  .onDelete((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["participants"];
        console.log("Counter value before update", c);
        c--;
        console.log("Counter value after update", c);
        counters.update({"participants": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });
  /* #############################################################################
  incrementLaboratories
  Add 1 to counter when a document is added to the collection laboratories
  ############################################################################# */
  exports.incrementLaboratories = functions
  .region('europe-west1')
  .firestore
  .document('laboratories/{laboratoryID}')
  .onDelete((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["laboratories"];
        console.log("Counter value before update", c);
        c++;
        console.log("Counter value after update", c);
        counters.update({"laboratories": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });
  /* #############################################################################
  decrementLaboratories
  Subtract 1 to counter when a document is deleted from the collection laboratories
  ############################################################################# */
  exports.decrementLaboratories = functions
  .region('europe-west1')
  .firestore
  .document('laboratories/{laboratoryID}')
  .onDelete((snap, context) => {
    counters.get().then(snapshot =>{
    try{
        let c = snapshot.data()["laboratories"];
        console.log("Counter value before update", c);
        c--;
        console.log("Counter value after update", c);
        counters.update({"laboratories": c});
    }
    catch(error){
      console.log(error);
    }
    })
    .catch(err =>{
      console.log("Failed to update counters:", err);
      reject(null);
    });
    return null;
  });


}

main().catch(console.error);
