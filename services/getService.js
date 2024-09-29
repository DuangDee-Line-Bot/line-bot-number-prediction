export const fetchData = async () => {
  try {
    const response = await fetch("https://api-line-bot.onrender.com/api/data");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

export const fetchOTP = async () => {
  try {
    const response = await fetch("https://api-line-bot.onrender.com/api/otp"); // Replace with your API URL
    const data = await response.json();
    globalOtp = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
export const getGlobalOTP = async () => {
  return globalOtp;
};
export const findData = async (responseMessaage, jsonData, otp) => {
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
};
export const handleImage = async (message, replyToken) => {
  return replyText(replyToken, "Got Image");
};
export const handleVideo = async (message, replyToken) => {
  return replyText(replyToken, "Got Video");
};
export const handleAudio = async (message, replyToken) => {
  return replyText(replyToken, "Got Audio");
};
export const handleLocation = async (message, replyToken) => {
  return replyText(replyToken, "Got Location");
};
export const handleSticker = async (message, replyToken) => {
  return replyText(replyToken, "Got Sticker");
};
