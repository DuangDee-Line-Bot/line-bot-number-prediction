// controllers/lineController.js

const { Client } = require("@line/bot-sdk");

// Line SDK client
const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

// Handle Line webhook events
const lineService = require("../services/lineService");

exports.handleWebhook = (req, res) => {
  // Handle all events
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};

// Function to handle each event
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const replyMessage = lineService.createReplyMessage(event.message.text);
  return client.replyMessage(event.replyToken, replyMessage);
}

// Create a response message
const replyMessage = {
  type: "text",
  text: `You said: ${event.message.text}`,
};

// Reply to the message
return client.replyMessage(event.replyToken, replyMessage);
