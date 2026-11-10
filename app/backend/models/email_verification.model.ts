const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otpCode: {
      type: Number,
      required: true,
    },
    timeStamp: {
      type: Number,
      required: true,
    },
    isVerified: {
      default: false,
      required: true,
      type: Boolean,
    },
    hasOtpExpired: {
      default: false,
      required: true,
      type: Boolean,
    },
  },
  { timestamps: true }
);
let emailVerification =
  mongoose.models.emailVerification ||
  mongoose.model("emailVerification", Schema);
export default emailVerification;
