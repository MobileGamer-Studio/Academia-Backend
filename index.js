const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const mod = require("./feed-manager.js");


app.get("/", (req, res) => res.send('Academia Backend'));

app.listen(port, () => mod.GetCollectionData().then(() => mod.SetFeedData()));


