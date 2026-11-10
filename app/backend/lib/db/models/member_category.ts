import mongoose, { Schema, Document, Model } from "mongoose";
import seedData from "../../seed-data/member-category.json";

export interface IMemberCategory extends Document {
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const MemberCategorySchema = new Schema<IMemberCategory>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MemberCategoryModel: Model<IMemberCategory> =
  mongoose.models.MemberCategory ||
  mongoose.model<IMemberCategory>("MemberCategory", MemberCategorySchema);

export const createOrSeedMemberCategory = async () => {
  await new Promise(async (resolve) => {
    try {
      for (const category of seedData) {
        const existingCategory = await MemberCategoryModel.findOne({
          code: category.code,
        });
        if (!existingCategory) {
          const data = new MemberCategoryModel(category as IMemberCategory);
          await data.save();
        }
      }
    } catch (error) {
      console.error("error while seeding member category", error?.message);
    } finally {
      resolve(true);
    }
  });
};

export default MemberCategoryModel;
