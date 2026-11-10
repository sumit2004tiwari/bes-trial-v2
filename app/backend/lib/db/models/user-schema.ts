import mongoose, { Document, Model, Schema } from "mongoose";

export enum UserStatus {
  PendingEmailVerification = "pending_email_verification",
  EmailVerified = "email_verified",
  ProfileCompleted = "profile_completed",
  Approved = "approved",
  Rejected = "rejected",
  Inactive = "inactive",
  Active = "active",
  Deleted = "deleted",
}
export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  passwordHash?: string;
  role: "admin" | "regular";
  status: UserStatus;
  rejectionMsg?: string;
  createdAt: Date;
  updatedAt: Date;
  verificationToken: string;
  verificationTokenExpires: Date;
  id: string;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },

    role: {
      type: String,
      enum: ["regular", "admin"],
      default: "regular",
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PendingEmailVerification,
    },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    rejectionMsg: { type: String }, // optional, only set if rejected
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
