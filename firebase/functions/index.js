'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// async..await is not allowed in global scope, must use a wrapper
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
  // Sends an email confirmation when a user changes his mailing list subscription.
  exports.sendREgistrationEmail = functions
  .region('europe-west1')
  .firestore
      .document('participants/{participantID}')
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
    mailOptions.subject = "Welcome to CARaDOC 2020!";
    mailOptions.text = "";
    mailOptions.html = fs.readFileSync("./email_body_register.html")
                         .toString()
                         .replace(/participantID/g, id)
                         .replace(/participantFirstName/g, participant.contact.firstName)
                         .replace(/participantLastName/g, participant.contact.lastName)
                         .replace(/WORKSHOP/g, participant.eventChoices.workshop);
    
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

  exports.sendREgistrationEmail = functions
  .region('europe-west1')
  .firestore
      .document('participants/{participantID}')
      .onUpdate((snap, context) => {
        const participant = snap.data();

        // access a particular field as you would any JS property
        const id = snap.id;
        const firstName = participant.contact.firstName;
        console.log("New doc id: ", id, " and firstname: ", firstName);

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
                           .replace(/participantLastName/g, participant.contact.lastName)
                           .replace(/WORKSHOP/g, participant.eventChoices.workshop);
      
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


}

main().catch(console.error);
