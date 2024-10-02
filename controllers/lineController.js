"use strict";

require("dotenv").config();
// const line = require("@line/bot-sdk");

// const config = {
//   channelAccessToken: process.env.channelAccessToken,
//   channelSecret: process.env.channelSecret,
// };
// // Line SDK client

// const client = new line.messagingApi.MessagingApiClient(config);

// // Handle Line webhook events

// function handleWebhook(req, res) {
//   // Handle all events
//   Promise.all(req.body.events.map(handleEvent))
//     .then((result) => res.json(result))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).end();
//     });
// }
const line = require("@line/bot-sdk");
const getService = require("../services/getService");
const fileStorage = require("../services/fileStorageService");
// Line SDK client
// const client = new Client({
//   channelAccessToken: process.env.channelAccessToken,
// });
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};
const client = new line.messagingApi.MessagingApiClient(config);
getService.fetchOTP();
let globalOtp = getService.getGlobalOTP();

// function getGlobalOTP() {
//   return globalOtp;
// }
// Handle Line webhook events
exports.handleWebhook = (req, res) => {
  // Handle all events
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};
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
// Function to handle each event
async function handleEvent(event) {
  const otp = await getService.getGlobalOTP();
  const data = await getService.fetchData();
  const localOTP = fileStorage.readStorage();
  const checkOTP = await otp.find((otps) => otps.otp == event.message.text);
  const checkData = await data.find((data) => data.key == event.message.text);
  if (checkData) {
    const checkOTPLocal = await otp.find((otps) => otps.otp == localOTP);
    if (checkOTPLocal == undefined) {
      fileStorage.writeStorage("");

      replyText(
        event.replyToken,
        "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
        event.message.quoteToken
      );
    } else {
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
    }
  } else if (checkOTP) {
    fileStorage.writeStorage(event.message.text);
    console.log("your storage: " + fileStorage.readStorage());
    console.log("replyToken: " + event.replyToken);
    console.log("quoteToken: " + event.message.quoteToken);

    return replyText(
      event.replyToken,
      "OTP ของคุณถูกต้อง",
      event.message.quoteToken
    );
  } else {
    replyText(
      event.replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      event.message.quoteToken
    );
  }
}
async function handleText(message, replyToken) {
  const data = await getService.fetchData();
  const localOTP = fileStorage.readStorage();
  const otp = await getService.getGlobalOTP();
  const checkOTPLocal = await otp.find((otps) => otps.otp == localOTP);
  const localCreatedDate = new Date(checkOTPLocal.createdDate).getTime();
  const checkExpireDate = Date.now() - localCreatedDate;
  console.log("handleText checkOTPLocal" + checkOTPLocal.otp);

  if (checkExpireDate > Date.now()) {
    fileStorage.writeStorage("");
    return replyText(
      replyToken,
      "OTP หมดอายุแล้ว\nโปรดส่งรหัส OTP ใหม่",
      message.quoteToken
    );
  }

  // if (checkOTPLocal) {
  return replyText(
    replyToken,
    await getService.findData(message.text, data),
    message.quoteToken
  );
  // } else {
  //   console.log("Your OTP does not match");
  //   return replyText(
  //     replyToken,
  //     "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
  //     message.quoteToken
  //   );
  // }
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

// Reply to the message
