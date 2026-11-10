import mongoConnection from "../../db/db-config";
import AuthSessionModel from "../../db/models/auth_session";
import {
  IAuthSession,
  IAuthToken,
  IAuthUser,
  ILoginDetails,
  PlainUserObject,
  UserObject,
} from "../../types";
import { CookiesService } from "../cookies-service";
import EmailVerificationService from "../email-verification-service";
import JwtTokenService from "../jwt-service";
import { CryptoToken } from "../crypto-token";
import { UserService } from "../user-services";
import { ServiceType } from "../../db/models/email-verification";
import { emailValidator } from "@/app/Utility/validator";
import { generateUniqueLink } from "@/app/backend/helper/helper";
import { LOCAL_URL, PRODUCTION_URL } from "@/app/backend/constant";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import { LoginError } from "@/app/_shared/custom-error/login-error";
import { UserStatus } from "../../db/models/user-schema";

export default class UserAuthService {
  private user: UserService;
  private avoidSettingAndResettingCookie: boolean;
  constructor(avoidSettingAndResettingCookie?: boolean) {
    this.user = new UserService();
    this.avoidSettingAndResettingCookie = !!avoidSettingAndResettingCookie;
  }
  createLoginAccessToken;
  async loginAccessToken(
    userDetails: IAuthUser,
    refreshToken: string
  ): Promise<string> {
    const { firstName, lastName, email, role, status } = userDetails;
    const jwtTokenService = new JwtTokenService();
    const jwtToken = await jwtTokenService.createTokenUsingRefresh(
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
        status: status,
      },
      refreshToken,
      role === "admin" ? "5m" : "30m"
    );
    return jwtToken;
  }
  async createAuthSession(
    user: PlainUserObject,

    isAdmin: boolean,
    sessionData: Record<string, string | number | boolean>
  ): Promise<IAuthToken> {
    await mongoConnection.connect();
    const refreshTokenService = new CryptoToken();
    const refreshToken = refreshTokenService.generateToken(user.id, user.email);
    let day = isAdmin ? 1 : 7;

    const session = new AuthSessionModel({
      userId: user.id,
      token: refreshToken,
      loginMethod: "password",

      expiresAt: new Date(Date.now() + day * 24 * 60 * 60 * 1000), // 7 days
      ...sessionData,
    });

    await session.save();
    return {
      refreshToken,
      accessToken: await this.loginAccessToken(
        {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        refreshToken
      ),
    };
  }

  async login(email: string, password: string): Promise<ILoginDetails | null> {
    await mongoConnection.connect();
    const user = await this.user.getUserByEmail(email);
    if (!user) {
      return null;
    }
    if (user.status === UserStatus.PendingEmailVerification)
      throw ErrorWithStatusCode.error401(
        "Please verify your email",
        false,
        "Email is in " + user.status
      );
    const isPasswordValid = await this.user.comparePassword(
      user.passwordHash,
      password
    );
    if (!isPasswordValid) {
      return null;
    }

    if (user.role === "admin") {
      const cryptoTokenService = new CryptoToken();
      let payloadToken = cryptoTokenService.encryptEmailPasswordPayload(
        user.email,
        password
      );
      await EmailVerificationService.sendOrResendOtp(
        email,
        ServiceType.ADMIN_LOGIN
      );
      return {
        needToVerifyUsingOtp: true,
        payloadToken,
        isLogin: false,
      };
    }
    let tokens = await this.createAuthSession(user, false, {});
    return {
      ...tokens,
      isLogin: true,
      needToVerifyUsingOtp: false,
    };
  }
  async logout() {
    try {
      const token = await CookiesService.getLoginCookies();
      await mongoConnection.connect();
      await AuthSessionModel.updateOne(
        { token: token?.refreshToken },
        {
          status: "signout",
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      );
    } catch (e) {
      console.log("Signout error -1 ", e?.message);
    }
    try {
      let cookieManager = await CookiesService.deleteLoginCookies();
    } catch (e) {
      console.log("Signout error -2 ", e?.message);
    } finally {
      return true;
    }
  }
  async otpLogin(otp: string, payload: string) {
    await mongoConnection.connect();
    // verify otp
    const cryptoTokenService = new CryptoToken();
    const { email, password } =
      cryptoTokenService.decryptEmailPasswordPayload(payload);
    const user = await this.user.getUserByEmail(email);
    const isPasswordValid = await this.user.comparePassword(
      user.passwordHash,
      password
    );
    if (!isPasswordValid) {
      return null;
    }

    const isOtpValid = await EmailVerificationService.verifyOtp(
      email,
      otp,
      ServiceType.ADMIN_LOGIN
    );
    if (!isOtpValid) {
      return null;
    }

    let tokens = await this.createAuthSession(user, user.role === "admin", {});
    return {
      login: true,
      ...tokens,
    };
  }

  async sendOtpForAdminLogin(payload: string): Promise<string> {
    await mongoConnection.connect();

    // Generate and send OTP

    const cryptoTokenService = new CryptoToken();
    const { email } = cryptoTokenService.decryptEmailPasswordPayload(payload);
    const user = await this.user.getUserByEmail(email);
    if (!user || user.role !== "admin") {
      throw new Error("User not found or not an admin");
    }
    const otpCode = EmailVerificationService.sendOrResendOtp(
      email,
      ServiceType.ADMIN_LOGIN
    );
    return otpCode;
  }

  async validateRefreshToken(refreshToken: string, email: string) {
    const session = await AuthSessionModel.findOne({
      token: refreshToken,
    })
      .populate("userId")
      .exec();
    const currentDate = new Date();
    if (
      !session ||
      session.expiresAt < currentDate ||
      session.status !== "active"
    ) {
      return null;
    }
    if (email) {
      const sessionUser = session.userId as any as UserObject;
      if (sessionUser?.email !== email) {
        return null;
      }
    }
    return session;
  }
  async regenerateAccessToken(
    refreshToken: string
  ): Promise<IAuthSession | null> {
    await mongoConnection.connect();

    const session = await AuthSessionModel.findOne({
      token: refreshToken,
    })
      .populate("userId")
      .exec();
    if (!session) return null;
    const currentDate = new Date();
    if (session.expiresAt < currentDate || session.status !== "active") {
      return null;
    }
    const userDetails = session.userId as any as UserObject;
    const newAccessToken = await this.loginAccessToken(
      {
        firstName: userDetails.first_name,
        lastName: userDetails.last_name,
        email: userDetails.email,
        role: userDetails.role,
        status: userDetails.status,
      },
      refreshToken
    );
    return { accessToken: newAccessToken };
  }

  async validateAndRegenerateTokenAndSetCookie(): Promise<IAuthUser | null> {
    try {
      const token = await CookiesService.getLoginCookies();

      if (!token?.refreshToken || !token.accessToken) {
        return null;
      }
      let accessToken = token.accessToken;
      let refreshToken = token.refreshToken;
      const jwtService = new JwtTokenService();
      const tokenValidation = await jwtService.verifyLoginTokenWithExpiry(
        accessToken,
        refreshToken
      );
      if (tokenValidation.valid) {
        if (tokenValidation.expired) {
          const session = await this.regenerateAccessToken(token.refreshToken);
          if (!session && !this.avoidSettingAndResettingCookie) {
            await this.logout();
            return null;
          }
          if (!this.avoidSettingAndResettingCookie)
            await CookiesService.setLoginCookies(
              session.accessToken,
              token.refreshToken
            );

          accessToken = session.accessToken;
          refreshToken = token.refreshToken;
        }

        const userDetails = await jwtService.getUserDetailsFromAccessToken(
          accessToken,
          refreshToken
        );
        if (!userDetails?.email) {
          return null;
        }
        const dbUser = await this.user.getUserByEmail(userDetails.email);
        const isBlockedUser =
          !dbUser ||
          [
            UserStatus.Deleted,
            UserStatus.Inactive,
            UserStatus.Rejected,
            UserStatus.PendingEmailVerification,
          ].includes(dbUser.status as UserStatus);
        if (isBlockedUser) {
          if (!this.avoidSettingAndResettingCookie) {
            await this.logout();
          }
          return null;
        }
        return {
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          email: dbUser.email,
          role: dbUser.role,
          status: dbUser.status,
        };
      }
    } catch (e) {
      console.log("error in validateAndRegenerateTokenAndSetCookie", e);
      return null;
    }
  }
  async forgetPassword(email: string) {
    let isValidEmail = emailValidator(email);
    let uniqueId = generateUniqueLink();
    if (!isValidEmail) return false;
    try {
      const jwtService = new JwtTokenService();
      let jwtToken = await jwtService.createToken({ email }, "1h");
      let url =
        process.env.enviroment === "production" ? PRODUCTION_URL : LOCAL_URL;
      url += "/account_setup/" + uniqueId + "/" + jwtToken;

      let result = await this.user.resetPassword(email, uniqueId, 1);
      if (!result) throw ErrorWithStatusCode.error404("User not found");
      await EmailVerificationService.sendMailForResendPassword(url, email);
    } catch (e) {
      console.log("error in forgot password", e?.message);
      console.log(e);
      throw e;
    }
  }

  async setUpNewPassword(
    token: string,
    jwtToken: string,
    password1: string,
    password2: string
  ) {
    try {
      if (password1 !== password2 || !password1 || !password2) {
        throw ErrorWithStatusCode.error422(
          "Password does not match",
          false,
          ""
        );
      }

      if (!token || !jwtToken) {
        throw ErrorWithStatusCode.error401(
          "Invalid Forgot Password Token",
          true
        );
      }
      const jwtService = new JwtTokenService();
      const isValid = await jwtService.verifyTokenWithExpiry(jwtToken);
      if (isValid.expired)
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "Expired Jwt Token: " + jwtToken + " verify: " + token
        );
      if (!isValid.valid)
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "Invalid JwtToken: " + jwtToken + " verify: " + token
        );
      const decodePayload: any = await jwtService.decodeToken(jwtToken);
      const email = decodePayload?.email || "";
      if (!email)
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "email not Found from jwt: " +
            " " +
            jwtToken +
            " " +
            email +
            "Verfiy : " +
            token
        );
      const result = await this.user.getUserToken(token);
      if (!result)
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "Invalid Verification Token: " + jwtToken + "Verify: " + token
        );
      let payloadEmail = email?.toLowerCase()?.trim();
      let resultEmail = result?.email?.toLowerCase()?.trim();
      if (payloadEmail !== resultEmail)
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "payload Email is not matched with db email" +
            payloadEmail +
            " 2" +
            resultEmail +
            "jwtToken" +
            jwtToken
        );
      const verificationTokenExpires = result.verificationTokenExpires;
      if (verificationTokenExpires < new Date()) {
        throw LoginError.invalidOrExpiredForgotPasswordToken(
          true,
          "Db Token Expired: " + jwtToken + "Verify: " + token
        );
      }
      let result2 = await this.user.updatePassword(email, password1);
      if (!result2) {
        throw ErrorWithStatusCode.error401("Something went wrong");
      }
      return true;
    } catch (e) {
      console.log(
        "error in setUpNewPassword: ",
        e?.message || e?.debugMessage || e?.newMessage
      );
      console.log(e);
      throw e;
    }
  }
  async validateForgotPasswordToken(uniqueToken: string, jwtToken: string) {
    try {
      const jwtService = new JwtTokenService();
      let valid = await jwtService.verifyTokenWithExpiry(jwtToken);

      if (valid.expired) {
        throw ErrorWithStatusCode.error401("Token expired");
      }

      if (!valid.valid) {
        throw ErrorWithStatusCode.error401("Invalid Token");
      }
      if (valid.valid && !valid.expired) {
        const decodePayload: any = await jwtService.decodeToken(jwtToken);
        if (!decodePayload?.email)
          throw ErrorWithStatusCode.error401(
            "Invalid Token",
            false,
            "Email not found"
          );

        return { isNewAccount: !!decodePayload?.isNewAccount, valid: true };
      }
      return { isNewAccount: false, valid: false };
    } catch (e) {
      console.log("error in validateAndUpdateToken", e?.message);

      return { isNewAccount: false, valid: false };
    }
  }

  async signUpEmailVerification(uniqueToken: string, jwtToken: string) {
    try {
      const jwtService = new JwtTokenService();
      const decodePayload: any = await jwtService.decodeToken(jwtToken);
      if (!decodePayload || !decodePayload?.email || !uniqueToken)
        throw ErrorWithStatusCode.error401(
          "Invalid Token",
          false,
          "Invalid code"
        );
      const userData = await this.user.getUserToken(uniqueToken);
      if (!userData)
        throw ErrorWithStatusCode.error401(
          "Invalid User or user not found",
          false,
          "User not found"
        );
      const payloadEmail = (decodePayload?.email || "").trim().toLowerCase();
      const email = userData?.email?.trim()?.toLocaleLowerCase();
      if (payloadEmail != email) {
        throw ErrorWithStatusCode.error401(
          "Invalid Token",
          false,
          "Invalid Token"
        );
      }
      if (userData?.status != UserStatus.PendingEmailVerification)
        throw ErrorWithStatusCode.error401(
          "Invalid Token Or Expired Token",
          true,
          "Email is already verified"
        );
      const result = await this.user.markEmailAsVerified(userData?.email);
      if (!result) throw new Error("Something went wrong");
      return result;
    } catch (e) {
      console.log(
        "error in signUp emailVerification",
        e?.message || e?.debugMessage || e?.newMessage
      );
      throw e;
    }
  }

  async isAdmin(writable?: boolean) {
    const userDetails = await this.validateAndRegenerateTokenAndSetCookie();
    const isAdminRole = userDetails?.role === "admin";
    if (!writable) return isAdminRole;
    const loginCookie = await CookiesService.getLoginCookies();
    try {
      if (!loginCookie.refreshToken) return null;
      const session = await this.validateRefreshToken(
        loginCookie.refreshToken,
        userDetails?.email
      );
      if (!session) return null;
      return true;
    } catch (e) {
      console.log("error in isAdmin", e?.message);
    }
  }
}

// todo to work in signup thing
