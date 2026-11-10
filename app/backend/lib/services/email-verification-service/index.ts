import { generateOtp } from "@/app/backend/helper/mailHelper/otpGenerator";
import EmailVerificationModel, {
  ServiceType,
} from "../../db/models/email-verification";
import { EmailService } from "../email-services";
import { generateOtpTemplate } from "@/app/backend/helper/mailHelper/template/otpTemplate";
import { generateSignupTemplate } from "@/app/backend/helper/mailHelper/template/signup_template";

class EmailVerificationService {
  static createOrUpdateOtp = async (
    email: string,
    otpCode: string,
    service: ServiceType
  ) => {
    return await EmailVerificationModel.findOneAndUpdate(
      { email, service },
      {
        otpCode,
        isVerified: false,
        hasOtpExpired: false,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 10 minutes from now
      },
      { upsert: true, new: true }
    );
  };

  static verifyOtp = async (
    email: string,
    otpCode: string,
    service: ServiceType
  ): Promise<boolean> => {
    try {
      const record = await EmailVerificationModel.findOne({
        email: email,
        otpCode: otpCode,
        service: service,
      });
      if (!record) {
        return false;
      }

      const currentTime = Date.now();
      const otpValidityDuration = 10 * 60 * 1000; // 10 minutes
      const isExpire = currentTime - record.timeStamp > otpValidityDuration;
      if (isExpire) {
        record.hasOtpExpired = true;
        await record.save();
        return false;
      }
      if (record.isVerified) {
        return false;
      }

      await EmailVerificationModel.findOneAndUpdate(
        { email, service, otpCode },
        { isVerified: true, hasOtpExpired: true }
      );
      return true;
    } catch (e) {
      console.log("Error verifying OTP:", e?.message);
      return false;
    }
  };
  static sendOrResendOtp = async (
    email: string,
    service: ServiceType
  ): Promise<string> => {
    // Generate a 4-digit OTP
    const otpCode = generateOtp(4);

    // Create or update the OTP record in the database
    await EmailVerificationService.createOrUpdateOtp(email, otpCode, service);

    const otpTemplate = generateOtpTemplate(otpCode);
    await EmailService.sendMail(
      email,
      "Your OTP Code For " + service,
      otpTemplate
    );
    return otpCode;
  };
  static async sendMailForResendPassword(url: string, email: string) {
    const emailTemplate = generateSignupTemplate(url);
    await EmailService.sendMail(
      email,
      "(Action Required) Reset Password",
      emailTemplate
    );
  }
}

export default EmailVerificationService;
