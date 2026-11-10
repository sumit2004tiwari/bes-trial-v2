import mongoConnection from "../lib/db/db-config";

const {
  default: emailVerification,
} = require("../models/email_verification.model");

export const updateEmailOtpOnDb = async ({ email, otp }: any) => {
  await mongoConnection.connect();
  const options = {
    new: true, // Return the updated document
    upsert: true, // Create the document if it doesn't exist
    setDefaultsOnInsert: true, // Apply schema defaults on insert
  };
  let data = await emailVerification.findOneAndUpdate(
    { email },
    {
      email,
      otpCode: otp,
      timeStamp: Date.now(),
      isVerified: false,
      hasOtpExpired: false,
    },
    options
  );
};

export const updateEmailOtpWithCustomAttribute = async (
  email: any,
  attribute: any
) => {
  await emailVerification.find({ email }, attribute);
};
