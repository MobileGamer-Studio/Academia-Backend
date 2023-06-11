const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require("./academia-c3d0e-firebase-adminsdk-o1rr9-7e2532c12c.json");

// Create a unique app name
const appName = 'Academia';

// Initialize Firebase app
const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://academia-c3d0e-default-rtdb.firebaseio.com',
}, appName);

// Create Firestore instance
const db = getFirestore(app);

module.exports = { app, db };
