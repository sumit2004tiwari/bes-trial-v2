import { applyFrontendDemoEnvironment } from "@/config/frontend-demo.cjs";

applyFrontendDemoEnvironment();

export const SENDER_EMAIL = process.env.SENDER_EMAIL;
export const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
export const SMTP_HOST = process.env.SMTP_HOST;
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const SMTP_PORT = process.env.SMTP_PORT;
export const ADMIN_RECEIVER_MAIL = process.env.ADMIN_RECEIVER_MAIL;
export const ENVIROMENT = process.env.enviroment;
export const PRODUCTION_URL = process.env.production_url;
export const LOCAL_URL = process.env.local_url;
export const LOGO_URL = "https://www.besindia.com/Images/Logo/logo_new.png";
export const EMAIL_TEMPLATE_LOGO_URL =
  "https://www.besindia.com/Images/Logo/logo1.png";
export const JSESSIONID = "jsessionId";
export const EVENT_DATE = "July 3-5, 2025";
export const EVENT_YEAR = 2025;

export const VENUE_DETAILS = "Hall No. 8,9 & 10 Pragati Maidan, New Delhi";
export const isDeveopment = process.env.enviroment === "development";
