// import { MONGODB_DB, MONGODB_URI } from "@/app/backend/config/constant";
import { MONGODB_DB, MONGODB_URI } from "../../../config/constant";
import mongoose from "mongoose";
import { frontendDemoEnabled } from "@/config/frontend-demo.cjs";

class MongoDBConnection {
  private static instance: MongoDBConnection;

  private readonly uri: string;
  private readonly dbName: string;

  private constructor() {
    this.uri = MONGODB_URI;
    this.dbName = MONGODB_DB;
    console.log("MongoDB connection initiated");
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (frontendDemoEnabled) {
      throw new Error("Database access is disabled in frontend demo mode.");
    }
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    // Check if connecting
    if (mongoose.connection.readyState === 2) {
      return new Promise((resolve, reject) => {
        mongoose.connection.once("connected", () => resolve(mongoose));
        mongoose.connection.once("error", reject);
      });
    }

    try {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(this.uri, {
        dbName: this.dbName,
        maxPoolSize: 10,
        connectTimeoutMS: 30000,
        serverSelectionTimeoutMS: 30000,
        bufferCommands: false,
      });

      console.log("MongoDB connected successfully");
      return mongoose;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

const globalForMongo = globalThis as unknown as {
  _mongoConnection?: MongoDBConnection;
};

const mongoConnection =
  globalForMongo._mongoConnection || MongoDBConnection.getInstance();

if (!globalForMongo._mongoConnection) {
  globalForMongo._mongoConnection = mongoConnection;
}

export default mongoConnection;
