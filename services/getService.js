let globalOtp = null;

exports.fetchData = async () => {
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

exports.fetchOTP = async () => {
  try {
    const response = await fetch("https://api-line-bot.onrender.com/api/otp"); // Replace with your API URL

    const data = await response.json();
    globalOtp = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
exports.getGlobalOTP = async () => {
  return await globalOtp;
};
exports.findData = async (responseMessaage, jsonData, otp) => {
  if (jsonData.find((x) => x.key == responseMessaage)) {
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
    return "ไม่พบข้อมูลที่ตรงกัน";
  }
};

exports.getGlobalOTP;
