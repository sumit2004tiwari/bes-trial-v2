import mongoose, { Schema, Document, Model } from "mongoose";

export const DEFAULT_EVENT_YEAR = 2025;

export const getPrefixFromYear = (year: number) =>
  `BES${String(year).slice(-2)}`;

export enum BesEventConfigKey {
  CurrentEvent = "current_event",
}

export interface IBesEventConfig extends Document {
  key: string;
  eventYear: number;
  prefix: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BesEventConfigSchema = new Schema<IBesEventConfig>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: BesEventConfigKey.CurrentEvent,
    },
    eventYear: {
      type: Number,
      required: true,
      default: DEFAULT_EVENT_YEAR,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const BesEventConfigModel: Model<IBesEventConfig> =
  mongoose.models.BesEventConfig ||
  mongoose.model<IBesEventConfig>("BesEventConfig", BesEventConfigSchema);

export const createOrSeedBesEventConfig = async () => {
  await new Promise(async (resolve) => {
    try {
      const existing = await BesEventConfigModel.findOne({
        key: BesEventConfigKey.CurrentEvent,
      });
      if (!existing) {
        const data = new BesEventConfigModel({
          key: BesEventConfigKey.CurrentEvent,
          eventYear: DEFAULT_EVENT_YEAR,
          prefix: getPrefixFromYear(DEFAULT_EVENT_YEAR),
          isActive: true,
        });
        await data.save();
      }
    } catch (error) {
      console.error("error while seeding bes event config", error?.message);
    } finally {
      resolve(true);
    }
  });
};

export default BesEventConfigModel;