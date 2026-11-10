import BookMySpace from "@/app/backend/models/book_my_space.model";
import "@/app/backend/models/space_type_scheme"; // IMPORTANT: registers model
import mongoConnection from "../../db/db-config";

export default class MySpaceServices {
  async getAllRegistrations() {
    try {
      await mongoConnection.connect();

      const mySpace = await BookMySpace.find(
        {},
        {
          _id: 0,

          name: 1,
          organisation: 1,
          email: 1,
          mobile: 1,

          city: 1,
          country: 1,
          postal_address: 1,

          space_sqm: 1,
          total_price_with_gst: 1,

          tracking_id: 1,
          createdAt: 1,

          space_scheme: 1, // ✅ ONLY keep ref field
        }
      )
        .populate({
          path: "space_scheme",
          select: "name price_per_sqm", // ✅ keep minimal
        })
        .sort({ createdAt: -1 })
        .lean();

      // ✅ Convert EVERYTHING to JSON-safe values
      const safeResult = mySpace.map((item: any) => ({
        name: item.name,
        organisation: item.organisation,
        email: item.email,
        mobile: item.mobile,
        city: item.city,
        country: item.country,
        postal_address: item.postal_address,
        space_sqm: item.space_sqm,
        total_price_with_gst: item.total_price_with_gst,
        tracking_id: item.tracking_id,

        createdAt: item.createdAt
          ? new Date(item.createdAt).toISOString()
          : null,

        space_scheme: item.space_scheme
          ? {
              id: item.space_scheme._id.toString(),
              name: item.space_scheme.name,
              price_per_sqm: item.space_scheme.price_per_sqm,
            }
          : null,
      }));

      return safeResult;
    } catch (e) {
      console.error("error in MySpaceServices", e);
      return null;
    }
  }
}
