"use server";

import { emailValidator, numberValidator } from "@/app/Utility/validator";
import { generateUniqueLink } from "../helper/helper";
import { sendMail } from "../api/sendMail/mail";
import { generateBcryptPassword } from "@/app/helper/helper";
import { ADMIN_RECEIVER_MAIL } from "../constant";
import { getPrefixReferenceNumber } from "../lib/services/bes-event-config-service";
import { visitorUserDetailsTemplate } from "../helper/mailHelper/template/visitorTemplate";
import feedbackDb from "@/app/about_bes/feedback/db.json";
import { cookies } from "next/headers";
import { emailSchema } from "@/app/helper/accountSchema";
import VisitorRegistration from "../models/visitor_registration.model";
import { generateOtpTemplate } from "../helper/mailHelper/template/otpTemplate";
import { generateOtp } from "../helper/mailHelper/otpGenerator";
import { updateEmailOtpOnDb } from "./updateDb";
import uniqueIdGenerator from "../helper/unique-id-generator";
import { signupSchema } from "@/app/_shared/validation-schema";
import { UserService } from "../lib/services/user-services";
import { SignupData } from "../lib/types";
import { expiryDate } from "../helper/util";
import EmailNotification from "../lib/services/notification/email-notification";
import JwtTokenService from "../lib/services/jwt-service";
import UserAuthService from "../lib/services/auth-service/user-auth-service";
import { CookiesService } from "../lib/services/cookies-service";
import {
  getVisitorCounter,
  updateVisitorCounter,
} from "../helper/visitor_helper/visitor_counter_helper";
// connect();
export const signUpAction = async (prevState: any, formData: any) => {
  const data = formData || {};
  const parsedData = signupSchema.safeParse(data);
  if (!parsedData.success) {
    const firstError = parsedData.error.errors[0].message;
    return { ...prevState, status: false, message: firstError };
  }
  const obj = parsedData.data;
  try {
    let uniqueId = generateUniqueLink();
    const user = new UserService();
    let passwordHash = await generateBcryptPassword(obj.password);

    const jwtService = new JwtTokenService();
    let jwtToken = await jwtService.createToken(
      { email: obj?.email, isNewAccount: true },
      "24h"
    );
    let url = "/account_setup/" + uniqueId + "/" + jwtToken;
    const verificationTokenExpires = expiryDate(24); // 24 hours from now
    await user.createUser({
      ...obj,
      passwordHash: passwordHash,
      verificationToken: jwtToken,
      unique: uniqueId,
      verificationTokenExpires,
    } as SignupData);
    await EmailNotification.memberSignup(obj?.email, url);
    return {
      ...prevState,
      status: true,
      message: "Account created successfully, please check your email",
    };
  } catch (e) {
    console.log("error while creating user", e?.debugMessage || e?.message);
    console.log(e);
    return {
      ...prevState,
      status: false,

      message: e.newMessage || "Something went wrong please try again later",
    };
  }
};

export const createNewPasswordAction = async (
  prevState: any,
  formData: any,
  slug1: any,
  slug2: any
) => {
  try {
    const password1 = formData.get("password");
    const password2 = formData.get("password2");
    const authService = new UserAuthService();
    const isValidate = await authService.setUpNewPassword(
      slug1,
      slug2,
      password1,
      password2
    );
    if (isValidate) {
      return {
        ...prevState,
        status: true,
        message: "Password has been successfully Reset...",
        hasToRedirect: false,
      };
    }
    throw new Error("Something went wrong");
  } catch (e) {
    return {
      ...prevState,
      status: false,
      hasToRedirect: e?.redirect || false,
      message: e?.newMessage || "Something went wrong",
    };
  }
};

export const checkAndUpdateToken = async (obj: {
  token: string;
  jwtToken: string;
}) => {
  try {
    let authService = new UserAuthService();
    const isValid = await authService.validateForgotPasswordToken(
      obj?.jwtToken,
      obj?.token
    );

    return isValid;
  } catch (e) {
    console.log("error in checkAndUpdateToken", e?.message);
    return false;
  }
};
export const forgotPasswordAction = async (prevState: any, formData: any) => {
  try {
    const email = formData?.get("email");
    const authService = new UserAuthService();
    await authService.forgetPassword(email);
    return {
      ...prevState,
      status: true,
      message:
        "Reset link has been sent to your email address, if it is registered with us",
    };
  } catch (e) {
    console.log("error in forgotpasswordAction", e?.message);
    return {
      ...prevState,
      status: false,
      message: e?.newMessage || "Something went wrong",
    };
  }
};

export const contactUsAction = async (prevState: any, formData: any) => {
  let retrieveParams = ["name", "email", "mobile", "message"];
  let obj: { [key: string]: string } = {};
  for (let key of retrieveParams) {
    let value = formData.get(key);
    value = value?.trim();
    if (!value) {
      return {
        ...prevState,
        status: false,
        message: "Please fill all the field",
      };
    }
    if (key === "email" && !emailValidator(value)) {
      return {
        ...prevState,
        status: false,
        message: "Email is not valid please try again with valid email",
      };
    }
    if (key === "mobile") {
      value = value.replace(/\D/g, "");
      if (!numberValidator(value)) {
        return {
          ...prevState,
          status: false,
          message:
            "Mobile number is not valid please try again with valid number",
        };
      }
    }
    obj[key] = value;
  }
  let template = visitorUserDetailsTemplate(obj, "New Enquiry");
  try {
    await sendMail({
      email: ADMIN_RECEIVER_MAIL,
      text: "",
      subject: "New Enquiry (urgent Action)",
      html: template,
    });
    // await new Promise((res) => {
    //   setTimeout(() => {
    //     res(1);
    //   }, 5000);
    // });
    return {
      ...prevState,
      status: true,
      message:
        "You request has been successfully submitted, we will get back you soon.",
    };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong",
    };
  }
};
export const feedbackFormAction = async (prevState: any, formData: any) => {
  let retrieveParams = feedbackDb;
  let obj: { [key: string]: string } = {};
  for (let params of retrieveParams) {
    const { key } = params;
    let value = formData.get(key);
    value = value?.trim();

    if (params.required) {
      if (!value) {
        return {
          ...prevState,
          status: false,
          message: "Please fill all the field",
        };
      }
      
      if (key === "email" && !emailValidator(value)) {
        return {
          ...prevState,
          status: false,
          message: "Email is not valid please try again with valid email",
        };
      }
      if (key === "mobile") {
        value = value.replace(/\D/g, "");
        if (!numberValidator(value)) {
          return {
            ...prevState,
            status: false,
            message:
              "Mobile number is not valid please try again with valid number",
          };
        }
      }
      obj[key] = value;
    } else if (value) {
      obj[key] = value;
    }
  }
  let template = visitorUserDetailsTemplate(obj, "New Feedback Recieved");
  try {
    await sendMail({
      email: ADMIN_RECEIVER_MAIL,
      text: "",
      subject: "New Feedback Recieved",
      html: template,
    });
    // await new Promise<void>((res) => {
    //   setTimeout(() => {
    //     res();
    //   }, 5000);
    // });
    return {
      ...prevState,
      status: true,
      message:
        "You request has been successfully submitted, we will get back you soon.",
    };
  } catch (e) {
    console.log(e);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong",
    };
  }
};

export const userOtpLoginAction = async (prevState: any, formData: any) => {
  const payload = formData.get("cookie-payload");
  const otp = formData.get("user-otp");

  if (!payload?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "Please enter valid email address.",
    };
  }
  if (!otp?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "OTP field can not be empty.",
    };
  }
  try {
    const authService = new UserAuthService();
    const authSession = await authService.otpLogin(otp, payload);
    if (!authSession) {
      return {
        ...prevState,
        status: false,
        message: "Invalid or expired otp, please try again.",
      };
    }
    CookiesService.setLoginCookies(
      authSession.accessToken,
      authSession.refreshToken
    );
    const userData = await CookiesService.getUserDetailsFromAccessToken();
    return {
      ...prevState,
      message: "Login Successfull",
      status: true,
      isLogin: true,
      userData: { ...userData },
    };
  } catch (e) {
    console.log(e);
    console.error("Error while otp login", e?.message);
    return {
      ...prevState,
      status: false,
      message: "Something went wrong, please try again later.",
    };
  }
};
export const userLoginAction = async (prevState: any, formData: any) => {
  const email = formData.get("email");

  const password = formData.get("password");
  if (!email?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "Please enter valid email address.",
    };
  }
  if (!password?.trim()) {
    return {
      ...prevState,
      status: false,
      message: "Passowrd field can not be empty.",
    };
  }
  try {
    const authService = new UserAuthService();
    const authSession = await authService.login(email, password);
    if (!authSession) {
      return {
        ...prevState,
        status: false,
        message: "Invalid email or password.",
      };
    }
    if (authSession.needToVerifyUsingOtp)
      return {
        ...prevState,
        status: false,
        needToVerifyUsingOtp: true,
        payload: authSession.payloadToken,
        message: "",
        isLogin: false,
      };
    CookiesService.setLoginCookies(
      authSession.accessToken,
      authSession.refreshToken
    );
    const userData = await CookiesService.getUserDetailsFromAccessToken();
    return {
      ...prevState,
      message: "Login Successfull",
      status: true,
      verifyUsingOtp: false,
      payload: "",
      isLogin: true,
      userData: { ...userData },
    };
  } catch (e) {
    console.log(e);
    console.error("Error while signin", e?.message);
    return {
      ...prevState,
      status: false,
      message: e?.newMessage || "Something went wrong, please try again later.",
    };
  }
};

export const deleteCookiesAction = async (key: any) => {
  let cookie = await cookies();
  cookie.delete(key);
};

export const getVisitorDetails = async (prevState: any, formData: any) => {
  const email = formData.get("email") || "";
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return {
      status: false,
      message: "Please enter valid email address",
    };
  }
  try {
    let user = await VisitorRegistration.findOne({ email: email }).lean(true);
    if (!user) {
      return {
        status: false,
        message: "Please enter valid email address",
        isError: true,
      };
    }
    if (!user?.unique_reference_number) {
      let urnNumber = (await getPrefixReferenceNumber()) + uniqueIdGenerator(7);
      await VisitorRegistration.updateOne(
        { email },
        { unique_reference_number: urnNumber }
      );
      user.unique_reference_number = urnNumber;
    }
    const jwtService = new JwtTokenService();
    let token = await jwtService.createToken({ email }, "15m");
    return {
      status: true,
      isError: false,
      message: "User Found",
      token,
    };
  } catch (e) {
    console.log(e);
    return {
      status: false,
      message: "Something went wrong",
      isError: true,
    };
  }
};

export const sendMailToUser = async (email: any) => {
  const subject = "Otp For Verification";
  let otp = generateOtp(4);
  if (!emailValidator(email)) {
    return {
      status: false,
      message: "Please enter valid email address",
    };
  }

  await sendMail({
    email,
    subject,
    html: generateOtpTemplate(otp),
  });
  await updateEmailOtpOnDb({ email, otp });
};

export async function updateVisitor() {
  try {
    return await updateVisitorCounter();
  } catch (e) {
    console.error("this is errro", e?.message);
    return 1;
  }
}

export const getVisitor = async () => {
  const hasSessionCookie = await CookiesService.getSessionCookie();
  if (hasSessionCookie) {
    return await getVisitorCounter();
  }
};
