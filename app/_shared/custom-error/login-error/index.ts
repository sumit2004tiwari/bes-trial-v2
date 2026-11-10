import CustomError from "..";
import ErrorWithStatusCode from "../error-with-status-code";

export class LoginError {
  static resendOrSendOtpEmail() {
    return new CustomError(
      "Invalid Verification or session expired please try again",
      401
    );
  }

  static invalidOrExpiredForgotPasswordToken(
    isRedirect: boolean,
    debugMessage?: string
  ) {
    return ErrorWithStatusCode.error401(
      "Invalid or expired token for password",
      isRedirect,
      debugMessage
    );
  }
}
