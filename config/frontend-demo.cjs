// This checkout previews the frontend by default. Set FRONTEND_DEMO_MODE=false
// to enable the real backend and require real deployment credentials again.
const frontendDemoEnabled = process.env.FRONTEND_DEMO_MODE !== "false";

function applyFrontendDemoEnvironment() {
  if (!frontendDemoEnabled) return;

  const origin = process.env.production_url?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  Object.assign(process.env, {
    FRONTEND_DEMO_MODE: "true",
    TOKEN_SECRET_KEY: "frontend-demo-token-key-not-for-production",
    SECRET_KEY: "frontend-demo-legacy-key-not-for-production",
    MONGODB_URI: "mongodb://127.0.0.1:27017/bes_frontend_demo",
    MONGODB_DB: "bes_frontend_demo",
    REFRESH_SECRET_KEY: "frontend-demo-refresh-key-not-for-production",
    GENERAL_SECRET_KEY: "frontend-demo-general-key-32-characters-long",
    INTERNAL_SECRET: "frontend-demo-internal-key-not-for-production",
    NEXT_PUBLIC_SERVICE_SECRET: "frontend-demo-public-payload-key",
    production_url: origin,
    local_url: "http://localhost:3000",
    enviroment: "production",
    SENDER_EMAIL: "demo@example.invalid",
    SENDER_EMAIL_PASSWORD: "frontend-demo-email-password",
    ADMIN_RECEIVER_MAIL: "admin@example.invalid",
    SMTP_HOST: "smtp.example.invalid",
    SMTP_PORT: "465",
    EMAIL_SERVICE: "",
    USECONTENTSTACK: "false",
    USEAWS: "false",
  });
}

module.exports = { frontendDemoEnabled, applyFrontendDemoEnvironment };
