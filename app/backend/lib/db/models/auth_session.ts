import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  deviceType?: string;
  deviceModel?: string;
  isMobile?: boolean;
  ipAddress?: string;
  location?: string;
  isp?: string;
  networkType?: string;
  loginMethod: "password" | "google" | "github" | "magic_link";
  appVersion?: string;
  language?: string;
  timezone?: string;
  screenResolution?: string;
  platform?: string;
  isFirstLogin: boolean;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isValid: boolean;
  status: "active" | "expired" | "revoked" | "verification_pending" | "signout";
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },

    // Device & Browser
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    deviceType: String,
    deviceModel: String,
    isMobile: Boolean,

    // Network
    ipAddress: String,
    location: String,
    isp: String,
    networkType: String,

    // Session details
    loginMethod: {
      type: String,
      enum: ["password", "google", "github", "magic_link"],
      required: true,
    },
    appVersion: String,
    language: String,
    timezone: String,
    screenResolution: String,
    platform: String,
    isFirstLogin: { type: Boolean, default: false },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "revoked", "verification_pending", "signout"],
      default: "active",
    },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AuthSessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
export default AuthSessionModel;
