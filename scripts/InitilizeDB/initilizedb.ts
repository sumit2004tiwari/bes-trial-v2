// scripts/initDb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { createSpaceTypeSchemeIfNotExist } from "../../app/backend/models/space_type_scheme";
import mongoConnection from "../..//app/backend/lib/db/db-config";
import { createOrAllServiceData } from "../../app/backend/lib/db/models/all_registration_services.model";
import { createOrSeedMemberCategory } from "../../app/backend/lib/db/models/member_category";
import { createOrSeedBesEventConfig } from "../../app/backend/lib/db/models/bes_event_config";

export async function seed() {
  try {
    await mongoConnection.connect();
    await createSpaceTypeSchemeIfNotExist();
    await createOrAllServiceData();
    await createOrSeedMemberCategory();
    await createOrSeedBesEventConfig();
  } catch (e) {
    console.error("already have valued");
  }
  console.log("all done");
  await mongoose.connection.close();
  process.exit(0);
}

if (require.main === module) {
  seed().catch((err) => {
    console.error("❌ Unhandled error:", err);
    process.exit(1);
  });
}
