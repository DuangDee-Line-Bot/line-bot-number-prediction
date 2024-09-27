"use strict";

const line = require("@line/bot-sdk");
const express = require("express");
const config = require("./config.json");
require("dotenv").config();
const fs = require("fs");
const storageFile = "localStorage.json";
const cron = require("node-cron");

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient(config);

const app = express();
let globalOtp = null;
fetchOTP();

// webhook callback
app.post("/webhook", line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(
    req.body.events.map((event) => {
      // console.log("event", event);
      return handleEvent(event);
    })
  )
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});
// File-Based Storage function
function readStorage() {
  if (!fs.existsSync(storageFile)) {
    return {};
  }
  const data = fs.readFileSync(storageFile);
  return JSON.parse(data);
}
function writeStorage(data) {
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
}
// simple reply function
const replyText = (replyToken, text, quoteToken) => {
  return client.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text,
        quoteToken,
      },
    ],
  });
};

// callback function to handle a single event
async function handleEvent(event) {
  const otp = getGlobalOTP();
  const data = await fetchData();
  const localOTP = readStorage();

  const checkOTP = await globalOtp.find(
    (otps) => otps.otp == event.message.text
  );
  const checkData = await data.find((data) => data.key == event.message.text);

  if (checkData) {
    switch (event.type) {
      case "message":
        const message = event.message;
        switch (message.type) {
          case "text":
            return handleText(message, event.replyToken);
          case "image":
            return handleImage(message, event.replyToken);
          case "video":
            return handleVideo(message, event.replyToken);
          case "audio":
            return handleAudio(message, event.replyToken);
          case "location":
            return handleLocation(message, event.replyToken);
          case "sticker":
            return handleSticker(message, event.replyToken);
          default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }

      case "follow":
        return replyText(event.replyToken, "Got followed event");

      case "unfollow":
        return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

      case "join":
        return replyText(event.replyToken, `Joined ${event.source.type}`);

      case "leave":
        return console.log(`Left: ${JSON.stringify(event)}`);

      case "postback":
        let data = event.postback.data;
        return replyText(event.replyToken, `Got postback: ${data}`);

      case "beacon":
        const dm = `${Buffer.from(event.beacon.dm || "", "hex").toString(
          "utf8"
        )}`;
        return replyText(
          event.replyToken,
          `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`
        );

      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  } else {
    replyText(
      event.replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      event.message.quoteToken
    );
  }
}
function fetchData() {
  return fetch("https://api-line-bot.onrender.com/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

async function fetchOTP() {
  try {
    const response = await fetch("https://api-line-bot.onrender.com/api/otp"); // Replace with your API URL
    const data = await response.json();
    globalOtp = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
cron.schedule("*/3 * * * *", () => {
  fetchOTP();
});
function getGlobalOTP() {
  return globalOtp;
}
function findData(responseMessaage, jsonData, otp) {
  if (jsonData.find((x) => x.key == responseMessaage)) {
    // for (let i = 0; i < jsonData.length; i++) {
    console.log("Correct!");
    // console.log(jsonData[responseMessaage]);

    for (let i = 0; i < jsonData.length; i++) {
      if (responseMessaage == jsonData[i].key) {
        return (
          jsonData[i].Aspect +
          "\n\n" +
          jsonData[i].TH +
          "\n\n" +
          jsonData[i].CH +
          "\n\n" +
          jsonData[i].ENG
        );
      }
    }
  } else {
    console.log("Data does not match!");

    return "ไม่พบข้อมูลที่ตรงกัน";
  }
}

async function handleText(message, replyToken) {
  const data = await fetchData();
  const localOTP = readStorage();
  console.log("handleText LocalOTP" + localOTP);

  const checkOTPMsg = await globalOtp.find((otps) => otps.otp == message.text);
  const checkOTPLocal = await globalOtp.find((otps) => otps.otp == localOTP);
  if (checkOTPMsg) {
    writeStorage(message.text);
    console.log("your storage: " + readStorage());
    return replyText(replyToken, "OTP ของคุณถูกต้อง", message.quoteToken);
  } else if (checkOTPMsg !== localOTP) {
    return replyText(
      replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      message.quoteToken
    );
  }
  if (checkOTPLocal) {
    return replyText(
      replyToken,
      findData(message.text, data),
      message.quoteToken
    );
  } else {
    console.log("Your OTP does not match");
    return replyText(
      replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      message.quoteToken
    );
  }
}

function handleImage(message, replyToken) {
  return replyText(replyToken, "Got Image");
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, "Got Video");
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, "Got Audio");
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, "Got Location");
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, "Got Sticker");
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
