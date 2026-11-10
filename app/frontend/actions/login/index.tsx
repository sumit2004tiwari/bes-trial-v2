import { fetchApiHub } from "..";

export const checkUserLoginStatus = () => {
  return fetchApiHub("/backend/api/auth/loginCheck/validateToken", "POST");
};

export const logout = () => {
  return fetchApiHub("/backend/api/auth/logout", "POST");
};

export const resendOtpAction = (payload: string) => {
  return fetchApiHub("/backend/api/auth/resend-otp", "POST", {
    payload,
  });
};
