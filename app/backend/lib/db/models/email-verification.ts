const mongoose = require("mongoose");

export enum ServiceType {
  SIGNUP = "signup",
  ADMIN_LOGIN = "admin_login",

  FORGOT_PASSWORD = "Reset Password",
}

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      // Remove enum validation from schema to allow future extensions
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
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 300 * 12, // 5 minutes in seconds
    },
  },
  { timestamps: true }
);

// Create compound unique index for email + service
Schema.index({ email: 1, service: 1 }, { unique: true });

let EmailVerificationModel =
  mongoose.models.emailVerificationLatest ||
  mongoose.model("emailVerificationLatest", Schema);
export default EmailVerificationModel;
