import mongoConnection from "../lib/db/db-config";

const {
  default: VisitorRegistration,
} = require("../models/visitor_registration.model");

export const getUserDetailFromUrn = async (urn: any) => {
  await mongoConnection.connect();
  const data = await VisitorRegistration.findOne({
    unique_reference_number: urn,
  });
  if (!data) throw new Error("User not found");
  return data;
};

export const getUserDetailFromEmail = async (email: any) => {
  await mongoConnection.connect();
  const data = await VisitorRegistration.findOne({ email });
  if (!data) throw new Error("User not found");
  return data;
};
