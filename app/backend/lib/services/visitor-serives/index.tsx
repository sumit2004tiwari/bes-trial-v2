import VisitorRegistration from "@/app/backend/models/visitor_registration.model";
import mongoConnection from "../../db/db-config";

export default class VisitorServices {
  async allVisitors() {
    try {
      await mongoConnection.connect();
      const visitors = await VisitorRegistration.find(
        {},
        {
          name: 1,
          _id: 0,
          unique_reference_number: 1,
          email: 1,
          mobile: 1,
          organisation: 1,
          area_of_work: 1,
          createdAt: 1,
        }
      )
        .sort({ createdAt: -1 })
        .lean();
      return visitors;
    } catch (e: any) {
      console.log("Something went wrong while getting visitor", e?.message);
      return null;
    }
  }
}
