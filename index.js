const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const fs = require('fs');

const serviceAccount = require("./academia-c3d0e-firebase-adminsdk-o1rr9-7e2532c12c.json");

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://academia-c3d0e-default-rtdb.firebaseio.com"
});

const firestore = getFirestore();


app.get("/", (req, res) => res.send('Academia Backend'));

app.use(express.static('data'))

app.listen(port, async () => {
    const productRef = firestore.collection('Products');
    const userRef = firestore.collection('Users');


    productRef.onSnapshot(snapshot => {
        const products = snapshot.docs.map(doc => doc.data());

        fs.writeFileSync("./data/products.json", JSON.stringify(products), 'utf8')

        products.forEach(product => {
            //This gives the product a rating based on likes and dislikes (out of five)
            const total_votes = product.likes + product.dislikes
            const ratio = product.likes / total_votes
            const rating = ratio * 5

            productRef.doc(product.id).update({
                ratings: rating
            })
        })


        firestore.collection('Users').get().then(async (snapshot) => {
            const users = snapshot.docs.map(doc => doc.data());

            const suggestedProducts = await productRef.orderBy('ratings', 'desc').get();
            const suggestedUsers = await userRef.orderBy('userInfo.rating', 'desc').get();
            const bestSellers = await productRef.orderBy('sold', 'desc').get();
            const sales = await productRef.orderBy('discount', 'desc').get();
            
            const activity = []

            users.forEach(user => {
                user.userInfo.recentlyViewed.forEach(productId => {
                    products.forEach(product => {
                        if (product.id == productId) {
                            if(activity.includes(product) === false) {
                                activity.push(product);
                            }
                        }
                    })
                })

                products.forEach(product => {
                    product.tags.forEach(tag => {
                        if (user.userInfo.tags.includes(tag)) {
                            if (suggestedProducts.includes(product) === false) {
                                suggestedProducts.unshift(product);
                            }
                        }
                    })
                })
            });

            

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


        })
    }, err => {
        console.log(`Encountered error: ${err}`);
    })


    userRef.onSnapshot(snapshot => {
        const users = snapshot.docs.map(doc => doc.data());

        fs.writeFileSync("./data/users.json", JSON.stringify(users), 'utf8')
    }, err => {
        console.log(`Encountered error: ${err}`);
    })
});


