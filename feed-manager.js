const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const fs = require('fs');


const serviceAccount = require("./academia-c3d0e-firebase-adminsdk-o1rr9-7e2532c12c.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://academia-c3d0e-default-rtdb.firebaseio.com"
});

const firestore = getFirestore();


const GetCollectionData = async () => {

  const productRef = firestore.collection('Products');
  const userRef = firestore.collection('Users');


  productRef.onSnapshot(snapshot => {
    const products = snapshot.docs.map(doc => doc.data());
    
    fs.writeFileSync("./data/products.json", JSON.stringify(products), 'utf8')
  }, err => {
    console.log(`Encountered error: ${err}`);
  })


  userRef.onSnapshot(snapshot => {
    const users = snapshot.docs.map(doc => doc.data());

    fs.writeFileSync("./data/users.json", JSON.stringify(users), 'utf8')
    
    
  }, err => {
    console.log(`Encountered error: ${err}`);
  })


  
}

const defaultFeed = {
  suggestedProducts: [],
  suggestedUsers: [],
  bestSellers: [],
  activity: [],
  new: [],
  sales: [],
}

const SetFeedData = async () => {
  const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
  const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

  const suggestedProducts = products.sort((p1, p2) => (p1.ratings < p2.ratings) ? 1 : (p1.ratings > p2.ratings) ? -1 : 0);
  const suggestedUsers = users.sort((p1, p2) => (p1.userInfo.rating < p2.userInfo.rating ) ? 1 : (p1.userInfo.rating > p2.userInfo.rating) ? -1 : 0);
  suggestedUsers.sort((p1, p2) => (p1.sellerInfo.rating < p2.sellerInfo.rating ) ? 1 : (p1.sellerInfo.rating > p2.sellerInfo.rating) ? -1 : 0);
  const bestSellers = products.sort((p1, p2) => (p1.sold < p2.sold) ? 1 : (p1.sold > p2.sold) ? -1 : 0);
  const activity = []
  users.forEach(user => {
    user.userInfo.recentlyViewed.forEach(productId => {
      products.forEach(product => {
        if (product.id == productId) {
          activity.push(product);
        }
      })
    })
  });
  const sales = products.sort((p1, p2) => (p1.discount < p2.discount) ? 1 : (p1.discount > p2.discount) ? -1 : 0);
  

  const defaultFeed = {
    suggestedProducts: suggestedProducts,
    suggestedUsers: suggestedUsers,
    bestSellers: bestSellers,
    activity: activity,
    newProducts: [],
    sales: sales,
  }

  fs.writeFileSync("./data/feed.json", JSON.stringify(defaultFeed), 'utf8')

  console.log(defaultFeed);
}


module.exports = {GetCollectionData, SetFeedData}