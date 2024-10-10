const expectedOTP = "123456"; // Expected OTP for verification
const expectedData = { username: "user123", password: "password123" }; // Sample data for validation
const otp = await getService.getGlobalOTP();
exports.checkOTP = (inputOTP) => {
  if (inputOTP === expectedOTP) {
    return true;
    return false;
  }
};

// Function to check data
exports.checkData = (inputData) => {
  if (
    inputData.username === expectedData.username &&
    inputData.password === expectedData.password
  ) {
    return true; // Data is correct
  } else {
    return false; // Data is incorrect
  }
};

// You can still use the logic below in this file or another file if imported:
const inputOTP = "123456"; // User's OTP input
const inputData = { username: "user123", password: "password123" }; // User's data input

// Main logic
if (checkOTP(inputOTP)) {
  if (checkData(inputData)) {
    console.log("OTP and Data are correct.");
  } else {
    console.log("OTP is correct, but Data is incorrect.");
  }
} else {
  console.log("Incorrect OTP.");
}
