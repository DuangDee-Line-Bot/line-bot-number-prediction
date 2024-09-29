// "use strict";

// const line = require("@line/bot-sdk");
// const express = require("express");
// const config = require("./config.json");
// require("dotenv").config();
// const fs = require("fs");
// const storageFile = "localStorage.json";
// const cron = require("node-cron");
// import { fetchData, fetchOTP } from "./services/getService.js";
// import { handleEvent } from "./services/handleService.js";
// // create LINE SDK client
// const client = new line.messagingApi.MessagingApiClient(config);

// let globalOtp = null;
// fetchOTP();

// // webhook callback

// // File-Based Storage function
// function readStorage() {
//   if (!fs.existsSync(storageFile)) {
//     return {};
//   }
//   const data = fs.readFileSync(storageFile);
//   return JSON.parse(data);
// }
// function writeStorage(data) {
//   fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
// }
// // simple reply function

// // callback function to handle a single event

// // function fetchData() {
// //   return fetch("https://api-line-bot.onrender.com/api/data")
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error("Network response was not ok");
// //       }
// //       return response.json();
// //     })
// //     .catch((error) => {
// //       console.error("There was a problem with the fetch operation:", error);
// //     });
// // }

// // async function fetchOTP() {
// //   try {
// //     const response = await fetch("https://api-line-bot.onrender.com/api/otp"); // Replace with your API URL
// //     const data = await response.json();
// //     globalOtp = data;
// //   } catch (error) {
// //     console.error("Error fetching data:", error);
// //   }
// // }
// cron.schedule("*/3 * * * *", () => {
//   fetchOTP();
// });

// const port = config.port;
// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });

// export default globalOtp;
