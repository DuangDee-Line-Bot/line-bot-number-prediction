// app.js

require("dotenv").config();
const express = require("express");
const { middleware } = require("@line/bot-sdk");
const bodyParser = require("body-parser");

// Line SDK config
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// Initialize express
const app = express();

// Use Line middleware to verify Line requests
app.use(middleware(config));

// Parse JSON request body
app.use(bodyParser.json());

// Use the controller to handle webhook
const lineController = require("./controllers/lineController");
app.post("/webhook", lineController.handleWebhook);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
