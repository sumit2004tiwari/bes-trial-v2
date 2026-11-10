import mongoose, { Document, Schema, Model } from "mongoose";

// TypeScript interface
export interface IBookMySpace extends Document {
  name: string;
  organisation: string;
  designation?: string;
  city: string;
  country: string;
  mobile: string;
  email: string;
  how_did_you_hear_about_expo?: string;
  tracking_id: String;
  gst_number?: number;
  postal_address: string;
  space_scheme: mongoose.Types.ObjectId;
  space_sqm: number;
  total_space_price: number;
  total_price_with_gst: number;
  total_gst_amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  selected_space_scheme: Object;
}

// Schema definition
const bookMySpaceSchema: Schema<IBookMySpace> = new Schema(
  {
    name: { type: String, required: true },
    organisation: { type: String, required: true },
    designation: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    how_did_you_hear_about_expo: { type: String },
    tracking_id: {
      type: String,
      required: true,
      unique: true,
      default: () => Date.now(),
    },
    gst_number: { type: Number },
    postal_address: { type: String, required: true },
    space_scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpaceTypeScheme",
      required: true,
    },
    selected_space_scheme: {
      type: Object,
      required: true,
    },
    space_sqm: {
      type: Number,
      required: true,
      min: 9,
    },
    total_space_price: { type: Number, required: true },
    total_price_with_gst: { type: Number, required: true },
    total_gst_amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Model export
const BookMySpace: Model<IBookMySpace> =
  mongoose.models.BookMySpace ||
  mongoose.model<IBookMySpace>("BookMySpace", bookMySpaceSchema);

export default BookMySpace;
