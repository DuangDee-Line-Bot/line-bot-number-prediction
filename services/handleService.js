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
export const handleEvent = async () => {
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
  } else if (checkOTP) {
    writeStorage(event.message.text);
    console.log("your storage: " + readStorage());
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
};

async function handleText(message, replyToken) {
  const data = await fetchData();
  const localOTP = readStorage();
  console.log("handleText LocalOTP" + localOTP);

  const checkOTPMsg = await globalOtp.find((otps) => otps.otp == message.text);
  const checkOTPLocal = await globalOtp.find((otps) => otps.otp == localOTP);
  const localCreatedDate = new Date(checkOTPLocal.createdDate).getTime();
  const checkExpireDate = Date.now() - localCreatedDate;
  console.log("handleText checkOTPLocal" + checkOTPLocal.otp);
  console.log("handleText expire" + dateObject.getTime() + "<" + Date.now());

  if (checkExpireDate > Date.now()) {
    writeStorage("");
    return replyText(
      replyToken,
      "OTP หมดอายุแล้ว\nโปรดส่งรหัส OTP ใหม่",
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
