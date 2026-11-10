import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVisitorRegistration extends Document {
  name: string;
  organisation: string;
  city: string;
  mobile: string;
  email: string;
  area_of_work: string;
  tracking_id: number;
  unique_reference_number: string;
  createdAt: Date;
  updatedAt: Date;
}

// Counter schema for auto-increment
interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create Counter model before VisitorRegistration
const Counter: Model<ICounter> =
  mongoose.models?.Counter ||
  mongoose.model<ICounter>("Counter", counterSchema);

const visitorSchema = new Schema<IVisitorRegistration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organisation: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    area_of_work: {
      type: String,
      required: true,
      trim: true,
    },
    tracking_id: {
      type: Number,
      required: true,
      unique: true,
    },
    unique_reference_number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Add index for better query performance
// visitorSchema.index({ tracking_id: 1 });

// Pre-validate hook to generate tracking_id BEFORE validation runs
visitorSchema.pre("validate", async function (next) {
  // Only generate if it's a new document and tracking_id doesn't exist
  if (this.isNew && !this.tracking_id) {
    try {
      // Get the next sequence number
      const counter = await Counter.findByIdAndUpdate(
        "visitorRegistration",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      if (!counter) {
        throw new Error("Failed to generate tracking ID");
      }

      // Combine timestamp (milliseconds) with auto-increment
      const timestamp = Date.now();
      const seq = counter.seq;

      // Format: timestamp * 10000 + sequence
      // Example: 17342592000000001, 17342592000000002, etc.
      this.tracking_id = timestamp + seq;

      next();
    } catch (error) {
      console.error("Error generating tracking_id:", error);
      next(error as Error);
    }
  } else {
    next();
  }
});

const VisitorRegistration: Model<IVisitorRegistration> =
  mongoose.models?.visitorRegistrationUser ||
  mongoose.model<IVisitorRegistration>(
    "visitorRegistrationUser",
    visitorSchema
  );

export default VisitorRegistration;
export { Counter };
