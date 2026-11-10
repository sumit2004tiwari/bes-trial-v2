import mongoose, { Document, Model } from "mongoose";
interface IVisitorCounter extends Document {
  numberOfVisitor: number;
}
export const visitorCounter = new mongoose.Schema<IVisitorCounter>({
  numberOfVisitor: {
    type: Number,
    default: 0,
    required: true,
  },
});

const VisitorCounter:Model<IVisitorCounter> =
  mongoose.models.visitorCounter ||
  mongoose.model("visitorCounter", visitorCounter);
export default VisitorCounter;
