import mongoose, { Schema, Document, Model } from "mongoose";

export enum MemberProfileStatus {
  InProgress = "in_progress",
  Approved = "approved",
  Rejected = "rejected",
}

export interface IApprovalHistory extends Document {
  status: MemberProfileStatus;
  message?: string;
  reviewedBy?: string;
  createdAt: Date;
}

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  membership_category: string;
  membership_no: string;
  mobile_no: string;
  designation?: string;
  organization_address: string;
  address2?: string;
  city: string;
  pin_code: string;
  state: string;
  status: MemberProfileStatus | null;
  rejectionMsg?: string;
  history: IApprovalHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const historySchema = new Schema<IApprovalHistory>(
  {
    status: {
      type: String,
      enum: Object.values(MemberProfileStatus),
      required: true,
    },
    message: { type: String },
    reviewedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    membership_category: { type: String, required: true },
    membership_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile_no: { type: String, required: true },
    designation: { type: String },
    organization_address: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    pin_code: { type: String, required: true },
    state: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(MemberProfileStatus),
      default: null,
    },
    rejectionMsg: { type: String },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

const UserProfileModel: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);

export default UserProfileModel;
