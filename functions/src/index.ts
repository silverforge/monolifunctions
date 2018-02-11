import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.get('/', (request, response) => {
    response.send({
        version: "1.0",
        name: "monolifunctions"
    });
});

app.get('/detected', (request, response) => {
    response.send({
        result: true
    });
});

function App(req, res) {
    if (!req.url) {
      req.url = '/';
      req.path = '/';
    }
    return app(req,res);
}

export const motion = functions.https.onRequest(App);
