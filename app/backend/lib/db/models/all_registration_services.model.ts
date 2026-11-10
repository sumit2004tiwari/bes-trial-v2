import mongoose, { Schema, Document, Model } from "mongoose";
import db from "../../seed-data/all-service.json";
export enum RegistrationServiceType {
  MY_SPACE = "my_space",
  VISITOR_REGISTRATIONS = "visitor_registration",
  DELEGATE_REGISTRATIONS = "delegate_registration",
}
export interface IService extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  service_name: RegistrationServiceType;
}

const ServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    service_name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true, // active by default
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
const AllRegistrationServiceTypeModel: Model<IService> =
  mongoose.models.AllServices ||
  mongoose.model<IService>("AllServices", ServiceSchema);

const MAX_RETRY = 3;
export const createOrAllServiceData = async (retry = 0) => {
  const seedData = db || [];
  await new Promise(async (resolve, reject) => {
    try {
      for (const service of seedData) {
        const existingService = await AllRegistrationServiceTypeModel.findOne({
          service_name: service.service_name,
        });
        if (!existingService) {
          console.log("Creating service", service.service_name);
          const data = new AllRegistrationServiceTypeModel(service as IService);
          await data.save();
        } else {
          console.log("allready havex", service.service_name);
        }
      }
    } catch (error) {
      console.log(error?.message);
      // createOrAllServiceData(retry + 1);
    } finally {
      resolve(true);
    }
  });
};

export default AllRegistrationServiceTypeModel;
