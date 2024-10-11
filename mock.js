async function handleEvent(event) {
  const otp = await getService.getGlobalOTP();
  const data = await getService.fetchData();
  const localOTP = fileStorage.readStorage();
  const checkOTP = await otp.find((otps) => otps.otp == event.message.text);

  if (!checkOTP) {
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
    return replyText(
      event.replyToken,
      "OTP ของคุณถูกต้อง",
      event.message.quoteToken
    );
  }
}
function isExpired(isoDate) {
  const expiryDate = new Date(isoDate);
  const now = new Date();
  return now.getTime() > expiryDate.getTime();
}

// Function to handle text event
async function handleText(message, replyToken) {
  const data = await getService.fetchData();
  const localOTP = fileStorage.readStorage();
  const otp = await getService.getGlobalOTP();
  const checkOTPLocal = await otp.find((otps) => otps.otp == localOTP);

  if (isExpired(checkOTPLocal.expiry)) {
    fileStorage.writeStorage("");
    return replyText(
      replyToken,
      "OTP หมดอายุแล้ว\nโปรดส่งรหัส OTP ใหม่",
      message.quoteToken
    );
  } else if (checkOTPLocal !== "") {
    return replyText(
      replyToken,
      await getService.findData(message.text, data),
      message.quoteToken
    );
  } else if (checkOTPLocal == "") {
    return replyText(
      replyToken,
      "OTP ไม่ตรงกันหรืออาจหมดอายุ\nโปรดส่งรหัส OTP ใหม่อีกครั้ง",
      message.quoteToken
    );
  }
}
