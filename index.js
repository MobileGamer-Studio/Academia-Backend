
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors")
const route = process.env.PORT || 3000;

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require("./academia-c3d0e-firebase-adminsdk-o1rr9-7e2532c12c.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://academia-c3d0e-default-rtdb.firebaseio.com"
});

const firestore = getFirestore();

const ManageData = async () => {
  // get collection
  const users = await firestore.collection('Users').get();
  console.log(users.docs.map(doc => doc.data()));
}

ManageData();