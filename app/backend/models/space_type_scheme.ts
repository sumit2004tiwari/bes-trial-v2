import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface

export interface ISpaceTypeScheme extends Document {
  type: "row-space" | "shell-space"; // You can make this dynamic later if needed
  price_per_sqm: number;
  is_active: boolean;

  description?: string;
  tax_rate: number;
  createdAt?: Date;
  updatedAt?: Date;
  minimum_space_rquired?: number;
  name: "Row space Scheme" | "Shell Space Scheme";
}

// Mongoose Schema
const spaceTypeSchemeSchema: Schema<ISpaceTypeScheme> = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["row-space", "shell-space"],
      unique: true,
    },
    name: {
      type: String,
      required: true,
      enum: ["Row space Scheme", "Shell Space Scheme"],
    },
    price_per_sqm: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
    },
    tax_rate: {
      type: Number,
      default: 18, // You can customize this per scheme
    },
    minimum_space_rquired: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Mongoose Model
const SpaceTypeScheme: Model<ISpaceTypeScheme> =
  mongoose.models.SpaceTypeScheme ||
  mongoose.model<ISpaceTypeScheme>("SpaceTypeScheme", spaceTypeSchemeSchema);

export async function createSpaceTypeSchemeIfNotExist() {
  try {
    const existing = await SpaceTypeScheme.findOne({ type: "row-space" });
    if (!existing) {
      // Create row space
      const rowSpace = new SpaceTypeScheme({
        type: "row-space",
        price_per_sqm: 1200,
        is_active: true,

        description: "Row Space Scheme",
        tax_rate: 18,
        name: "Row space Scheme",
        minimum_space_rquired: 9,
      } as ISpaceTypeScheme);
      await rowSpace.save();
      console.log("Row space scheme created");
    } else {
      console.log("Row space scheme already exists");
    }

    // Similarly for shell-space
    const existingShell = await SpaceTypeScheme.findOne({
      type: "shell-space",
    });
    if (!existingShell) {
      const shellSpace = new SpaceTypeScheme({
        type: "shell-space",
        price_per_sqm: 1400,
        is_active: true,

        description: "Shell Space Scheme",
        tax_rate: 18,
        name: "Shell Space Scheme",
        minimum_space_rquired: 13,
      } as ISpaceTypeScheme);
      await shellSpace.save();
      console.log("Shell space scheme created");
    } else {
      console.log("Shell space scheme already exists");
    }
  } catch (error) {
    console.error(error);
  }
}
export default SpaceTypeScheme;
