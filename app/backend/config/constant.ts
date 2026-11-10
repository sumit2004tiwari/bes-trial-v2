import { applyFrontendDemoEnvironment } from "@/config/frontend-demo.cjs";

applyFrontendDemoEnvironment();

export const MONGODB_URI = process.env.MONGODB_URI || "uri";

export const MONGODB_DB = process.env.MONGODB_DB || "test";
export const JWT_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
export const GENERAL_SECRET_KEY = process.env.GENERAL_SECRET_KEY;
