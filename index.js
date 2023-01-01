const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require("./academia-c3d0e-firebase-adminsdk-o1rr9-7e2532c12c.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://academia-c3d0e-default-rtdb.firebaseio.com"
});

const firestore = getFirestore();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});