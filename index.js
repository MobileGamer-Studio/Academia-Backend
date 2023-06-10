const express = require("express");
const fetchData = require("./sort");
const { getUser, getProduct, getChat } = require('./fetch');

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.send('Academia Backend'));

// Define GET routes for fetching data
app.get('/user', async (req, res) => {
  try {
    const userId = req.body.userId;
    const userData = await getUser(userId);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

app.get('/product', async (req, res) => {
  try {
    const productId = req.body.productId;
    const productData = await getProduct(productId);
    res.status(200).json(productData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

app.get('/chat', async (req, res) => {
  try {
    const chatId = req.body.chatId;
    const chatData = await getChat(chatId);
    res.status(200).json(chatData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(404).json({ error: error.message });
  }
});


app.use(express.static('data'));

app.listen(port, () => {
  // Run the fetchData function immediately
  fetchData();

  // Schedule the fetchData function to run every 1 minute
  setInterval(fetchData, 60000);
});
