import {
  GENERAL_SECRET_KEY,
  JWT_SECRET_KEY,
  REFRESH_SECRET_KEY,
} from "@/app/backend/config/constant";
import crypto from "crypto";
export class CryptoToken {
  private secretKey: string;
  private generalSecretKey = GENERAL_SECRET_KEY;
  constructor() {
    this.secretKey = REFRESH_SECRET_KEY;
  }
  public generateToken(userId: string, email: string): string {
    const random = crypto.randomBytes(32).toString("hex");
    const timestamp = Date.now().toString();
    const data = `${userId}-${email}-${random}-${timestamp}`;

    return crypto
      .createHmac("sha256", this.secretKey)
      .update(data)
      .digest("hex");
  }

  public encryptEmailPasswordPayload(email: string, password: string): string {
    const payload = JSON.stringify({ email, password });
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.generalSecretKey.slice(0, 32)),
      iv
    );
    let encrypted = cipher.update(payload, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  }

  public decryptEmailPasswordPayload(encryptedPayload: string): {
    email: string;
    password: string;
  } {
    const [ivHex, encrypted] = encryptedPayload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.generalSecretKey.slice(0, 32)),
      iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  }
  public encryptMessage = (msg: string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.generalSecretKey.slice(0, 32)),
      iv
    );
    let encrypted = cipher.update(msg, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  };

  public decryptMessage = (encryptedPayload: string) => {
    const [ivHex, encrypted] = encryptedPayload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.generalSecretKey.slice(0, 32)),
      iv
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };
}
