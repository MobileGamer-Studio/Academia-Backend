const fs = require('fs');

const products = JSON.parse(fs.readFile('./data/products.json', 'utf8'));


const highestRanked = products.sort((p1, p2) => {return p2.rating - p1.rating});
console.log(highestRanked);

const suggestedProducts = products.sort((p1, p2) => {return p2.rating - p1.rating});
            console.log(products);
            const suggestedUsers = users.sort((p1, p2) => {return p2.userInfo.rating - p1.userInfo.rating});
            const bestSellers = products.sort((p1, p2) => {return p2.sold - p1.sold});
            console.log(products);
            const sales = products.sort((p1, p2) => {return p2.discount - p1.discount});
            console.log(products);
