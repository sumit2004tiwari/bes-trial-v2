import otpGenerator from "otp-generator";
export const generateOtp = (length = 4) => {
  let otp = otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};
