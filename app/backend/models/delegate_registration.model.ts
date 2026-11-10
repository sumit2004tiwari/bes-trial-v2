import mongoose, { Model, Document } from "mongoose";

interface IDelegateUser extends Document {
  name: string;
  organisation: string;
  city: string;
  mobile: string;
  email: string;
  query?: string;
  category: string;
  payment_type: string;
  transaction_no: number;
  amount: number;
  other_details?: string;
  tracking_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  department: string;
  session_type: string;
  postal_address: string;
}

// Counter schema for auto-increment (shared with visitor model)
interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new mongoose.Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Create or get Counter model
const Counter: Model<ICounter> =
  mongoose.models?.Counter ||
  mongoose.model<ICounter>("Counter", counterSchema);

const delegateUserSchema = new mongoose.Schema<IDelegateUser>(
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
    department: {
      type: String,
      required: true,
      trim: true,
    },
    postal_address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: false,
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
    query: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    session_type: {
      type: String,
      required: false,
    },
    payment_type: {
      type: String,
      required: true,
    },
    transaction_no: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    other_details: {
      type: String,
      required: false,
    },
    tracking_id: {
      type: Number,
      required: true,
      unique: true,
      // Removed default: Date.now() - will be auto-generated
    },
  },
  { timestamps: true }
);

// Add index for better query performance
// delegateUserSchema.index({ tracking_id: 1 });

// Pre-validate hook to generate tracking_id BEFORE validation runs
delegateUserSchema.pre("validate", async function (next) {
  // Only generate if it's a new document and tracking_id doesn't exist
  if (this.isNew && !this.tracking_id) {
    try {
      // Get the next sequence number for delegates
      const counter = await Counter.findByIdAndUpdate(
        "delegateRegistration", // Different counter ID for delegates
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      if (!counter) {
        throw new Error("Failed to generate tracking ID for delegate");
      }

      // Combine timestamp (milliseconds) with auto-increment
      const timestamp = Date.now();
      const seq = counter.seq;

      // Format: timestamp * 10000 + sequence
      // Example: 17342592000000001, 17342592000000002, etc.
      this.tracking_id = timestamp + seq;

      next();
    } catch (error) {
      console.error("Error generating tracking_id for delegate:", error);
      next(error as Error);
    }
  } else {
    next();
  }
});

const DelegateUser: Model<IDelegateUser> =
  mongoose.models.delegateUser ||
  mongoose.model("delegateUser", delegateUserSchema);

export default DelegateUser;
export { Counter };
