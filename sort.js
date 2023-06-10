const { app, db } = require('./firebase');
const fs = require('fs');

const fetchData = async () => {
  try {
    const productRef = db.collection('Products');
    const userRef = db.collection('Users');

    const snapshot = await productRef.get();
    const products = snapshot.docs.map(doc => doc.data());

    fs.writeFileSync("./data/products.json", JSON.stringify(products), 'utf8');

    products.forEach(product => {
      const total_votes = product.likes + product.dislikes;
      const ratio = product.likes / total_votes;
      const rating = ratio * 5;

      productRef.doc(product.id).update({
        ratings: rating
      });
    });

    const usersSnapshot = await userRef.get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    const suggestedProducts = await productRef.orderBy('ratings', 'desc').get();
    const suggestedUsers = await userRef.orderBy('userInfo.rating', 'desc').get();
    const bestSellers = await productRef.orderBy('sold', 'desc').get();
    const sales = await productRef.orderBy('discount', 'desc').get();
            
    const activity = [];

    users.forEach(user => {
      user.userInfo.recentlyViewed.forEach(productId => {
        products.forEach(product => {
          if (product.id == productId) {
            if (activity.includes(product) === false) {
              activity.push(product);
            }
          }
        });
      });

      products.forEach(product => {
        product.tags.forEach(tag => {
          if (user.userInfo.tags.includes(tag)) {
            if (suggestedProducts.includes(product) === false) {
              suggestedProducts.unshift(product);
            }
          }
        });
      });
    });

    let spList = [];
    suggestedProducts.forEach(product => {
      spList.push(product.id);
    });

    let suList = [];
    suggestedUsers.forEach(user => {
      suList.push(user.id);
    });

    let bsList = [];
    bestSellers.forEach(product => {
      bsList.push(product.id);
    });

    let aList = [];
    activity.forEach(product => {
      aList.push(product.id);
    });

    let sList = [];
    sales.forEach(product => {
      sList.push(product.id);
    });

    const defaultFeed = {
      suggestedProducts: spList,
      suggestedUsers: suList,
      bestSellers: bsList,
      activity: aList,
      newProducts: [],
      sales: sList,
    };

    fs.writeFileSync("./data/feed.json", JSON.stringify(defaultFeed), 'utf8');

    users.forEach(user => {
      user.userInfo.feed = defaultFeed;
      db.collection('Users').doc(user.id).set(user);
      console.log(user.name + " feed updated");
    });

    console.log(defaultFeed);
  } catch (err) {
    console.log(`Encountered error: ${err}`);
  }
};

module.exports = fetchData;

