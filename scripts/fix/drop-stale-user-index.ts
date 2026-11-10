// scripts/fix/drop-stale-user-index.ts
// Runs: drops stale unique indexes on the "users" collection that no longer
// exist in the current User schema (e.g. the old "mobile_1" index) which
// cause `E11000 duplicate key error ... { mobile: null }` on signup.
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import mongoConnection from "../../app/backend/lib/db/db-config";

async function run() {
  await mongoConnection.connect();
  const collection = mongoose.connection.collection("users");
  const indexes = await collection.indexes();
  const stale = indexes.filter(
    (i) => i.name === "mobile_1" || Object.keys(i.key)[0] === "mobile"
  );
  for (const idx of stale) {
    console.log("Dropping stale index", idx.name);
    await collection.dropIndex(idx.name);
  }
  console.log(
    "Done. Remaining indexes:",
    (await collection.indexes()).map((i) => i.name)
  );
  await mongoose.connection.close();
  process.exit(0);
}

if (require.main === module) {
  run().catch((e) => {
    console.error("Failed to drop index", e);
    process.exit(1);
  });
}