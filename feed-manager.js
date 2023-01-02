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
    const suggestedUsers = users.sort((p1, p2) => (p1.userInfo.rating < p2.userInfo.rating) ? 1 : (p1.userInfo.rating > p2.userInfo.rating) ? -1 : 0);
    suggestedUsers.sort((p1, p2) => (p1.sellerInfo.rating < p2.sellerInfo.rating) ? 1 : (p1.sellerInfo.rating > p2.sellerInfo.rating) ? -1 : 0);
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

    let spList = [];
    suggestedProducts.forEach(product => {
        spList.push(product.id);
    })

    let suList = [];
    suggestedUsers.forEach(user => {
        suList.push(user.id);
    })

    let bsList = [];
    bestSellers.forEach(product => {
        bsList.push(product.id);
    })

    let aList = [];
    activity.forEach(product => {
        aList.push(product.id);
    })

    let sList = [];
    sales.forEach(product => {
        sList.push(product.id);
    })



    const defaultFeed = {
        suggestedProducts: spList,
        suggestedUsers: suList,
        bestSellers: bsList,
        activity: aList,
        newProducts: [],
        sales: sList,
    }



    fs.writeFileSync("./data/feed.json", JSON.stringify(defaultFeed), 'utf8')

    users.forEach(user => {
        user.userInfo.feed = defaultFeed;
        firestore.collection('Users').doc(user.id).set(user);
        console.log(user.name + " feed updated");
    })


    console.log(defaultFeed);
}


module.exports = { GetCollectionData, SetFeedData }