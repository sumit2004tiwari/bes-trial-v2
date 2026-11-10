import { ENVIROMENT, LOCAL_URL, PRODUCTION_URL } from "@/app/backend/constant";
import { EmailService } from "../email-services";
import { generateSignupTemplate } from "@/app/backend/helper/mailHelper/template/signup_template";

export default class EmailNotification {
  static async memberSignup(email: string, url: string) {
    try {
      let baseUrl =
        process.env.NODE_ENV === "production" ? PRODUCTION_URL : LOCAL_URL;
      let obj = {
        to: email,
        subject: "Action Required For New Account Creation",
        html: generateSignupTemplate(baseUrl + url),
      };
      console.log("email sending");
      await EmailService.sendMail(email, obj.subject, obj.html, obj.subject);
      console.log("email sent");
      return true;
    } catch (e) {
      console.error("Error In Signup Mail", e?.message);
      return false;
    }
  }
}
