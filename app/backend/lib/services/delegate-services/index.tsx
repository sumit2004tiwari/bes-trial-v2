import DelegateUser from "@/app/backend/models/delegate_registration.model";
import mongoConnection from "../../db/db-config";

export default class DelegateServices {
  async allRegistrations() {
    try {
      await mongoConnection.connect();
      const delegates = await DelegateUser.find(
        {},
        {
          name: 1,
          _id: 0,
          transaction_no: 1,
          amount: 1,
          other_details: 1,
          department: 1,
          email: 1,
          mobile: 1,
          session_type: 1,
          organisation: 1,
          payment_type: 1,
          postal_address: 1,
          createdAt: 1,
          tracking_id: 1,
        }
      )
        .sort({ createdAt: -1 })
        .lean();

      return delegates;
    } catch (e) {
      console.log("eeror in Delegate Services", e);
      return null;
    }
  }
}
