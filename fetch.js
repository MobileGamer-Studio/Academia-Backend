const { app, db } = require('./firebase');

// Function to fetch user data from Firestore
async function getUser(userId) {
  try {
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return userDoc.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Error fetching user data: ' + error.message);
  }
}

// Function to fetch product data from Firestore
async function getProduct(productId) {
  try {
    const productRef = db.collection('Products').doc(productId);
    const productDoc = await productRef.get();

    if (productDoc.exists) {
      return productDoc.data();
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    throw new Error('Error fetching product data: ' + error.message);
  }
}

// Function to fetch chat data from Firestore
async function getChat(chatId) {
  try {
    const chatRef = db.collection('Chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (chatDoc.exists) {
      return chatDoc.data();
    } else {
      throw new Error('Chat not found');
    }
  } catch (error) {
    throw new Error('Error fetching chat data: ' + error.message);
  }
}

module.exports = {
  getUser,
  getProduct,
  getChat,
};
