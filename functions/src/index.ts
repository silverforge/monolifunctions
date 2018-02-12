import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from 'express';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';

admin.initializeApp(functions.config().firebase);

const app = express();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

app.get('/', (request, response) => {
    response.send({
        version: "1.0",
        name: "monolifunctions"
    });
});

app.get('/detected', (request, response) => {

    admin.auth().listUsers()
        .then(results => {
            _.forEach(results.users, user => {
                // console.log(`::: USER MAIL ::: ${user.email}`);

                const mailOptions = {
                    from: `${gmailEmail}`,
                    to: user.email,
                    subject: "motion detected on hodor",
                    text: "Warning! Motion Detected on hodor!"
                };

                mailTransport.sendMail(mailOptions).then(() => {
                    console.warn(`Warning message sent to ${user.email}`);
                });
            });

            response.send({
                result: true
            });
        })
        .catch(err => console.error(err));
});

function App(req, res) {
    if (!req.url) {
      req.url = '/';
      req.path = '/';
    }
    return app(req,res);
}

export const motion = functions.https.onRequest(App);
