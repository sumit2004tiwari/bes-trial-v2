import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "regular"], // Restrict to these values
    required: true,
  },
  // Optional: Reference to UserMember model
});

const UserRole =
  mongoose.models.UserRole || mongoose.model("UserRole", userRoleSchema);

export default UserRole;
