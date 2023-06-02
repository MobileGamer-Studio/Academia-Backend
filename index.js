const express = require("express");
const fetchData = require("./sort");

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.send('Academia Backend'));

app.use(express.static('data'));

app.listen(port, () => {
  // Run the fetchData function immediately
  fetchData();

  // Schedule the fetchData function to run every 1 minute
  setInterval(fetchData, 60000);
});
