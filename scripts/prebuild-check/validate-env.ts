import { loadEnvConfig } from "@next/env";

// Match Next.js file precedence and preserve variables injected by Vercel.
// `yarn build` runs this before Next.js sets NODE_ENV to production.
const development = process.env.NODE_ENV === "development";
const { loadedEnvFiles } = loadEnvConfig(process.cwd(), development);
// Require after env loading so a local FRONTEND_DEMO_MODE=false is respected.
const { frontendDemoEnabled, applyFrontendDemoEnvironment } = require("../../config/frontend-demo.cjs");
applyFrontendDemoEnvironment();

if (loadedEnvFiles.length > 0) {
  console.log(`Loaded environment files: ${loadedEnvFiles.map((file) => file.path).join(", ")}`);
}

const requiredEnvs = [
  "SENDER_EMAIL",
  "SENDER_EMAIL_PASSWORD",
  "SMTP_HOST",
  "EMAIL_SERVICE",
  "SMTP_PORT",
  "ADMIN_RECEIVER_MAIL",
  "enviroment",
  "TOKEN_SECRET_KEY",
  "SECRET_KEY",
  "MONGODB_URI",
  "MONGODB_DB",
  "REFRESH_SECRET_KEY",
  "GENERAL_SECRET_KEY",
  "INTERNAL_SECRET",
  "NEXT_PUBLIC_SERVICE_SECRET",
  // A production deployment does not need a localhost URL.
  development ? "local_url" : "production_url",
] as const;

const hasValue = (key: string) => Boolean(process.env[key]?.trim());
const missing: string[] = requiredEnvs.filter((key) => !hasValue(key));

const contentfulEnvs = [
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENVIRONMENT",
  "CONTENTFUL_DELIVERY_ACCESS_TOKEN",
  "CONTENTFUL_PREVIEW_ACCESS_TOKEN",
  "CONTENTFUL_PREVIEW_SECRET",
] as const;

if (contentfulEnvs.some(hasValue)) {
  missing.push(...contentfulEnvs.filter((key) => !hasValue(key)));
} else {
  console.log("Contentful is not configured; CMS integration is disabled.");
}

if (frontendDemoEnabled) {
  console.log("Frontend demo mode: using dummy credentials. Database, email, authentication, and submissions are disabled.");
} else if (missing.length > 0) {
  console.error(
    [
      "Environment validation failed. Missing required variables:",
      ...missing.map((key) => `  - ${key}`),
      "",
      "Vercel: open Project Settings > Environment Variables and add these keys",
      "for the deployment environment (Production or Preview), then redeploy.",
      "Local: copy env.example to .env.local and fill in your actual values.",
      "See docs/deployment-environment.md for setup instructions.",
    ].join("\n")
  );
  process.exitCode = 1;
} else {
  console.log("All required environment variables are set.");
}
