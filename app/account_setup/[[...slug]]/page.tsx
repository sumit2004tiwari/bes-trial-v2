import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import CreateNewPassword from "./component/create_password";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import ErrorAlertToast from "@/app/UIComponent/common-ui/error-alert/error-alert-toast";
import SuccessToast from "@/app/UIComponent/common-ui/success-alert/success-toast";

export const dynamic = "force-dynamic";
export default async function page(req: any) {
  let { slug } = await req.params;
  slug = slug || [];
  const [uniqueToken, jwtToken] = slug;

  const authService = new UserAuthService();

  try {
    let isValid = await authService.validateForgotPasswordToken(
      uniqueToken,
      jwtToken
    );
    if (isValid.isNewAccount) {
      const verifyAccount = await authService.signUpEmailVerification(
        uniqueToken,
        jwtToken
      );
      if (verifyAccount) {
        return (
          <SuccessToast
            msg={"Email has been successfully verified"}
            show={true}
            redirect="/?action=login"
          />
        );
      } else {
        throw ErrorWithStatusCode.error404("Something went wrong");
      }
    }
    if (!isValid?.valid)
      return <ErrorAlertToast msg={"Invalid Token"} redirectTo={"/"} />;
    return <CreateNewPassword slug1={uniqueToken} slug2={jwtToken} />;
  } catch (e) {
    return (
      <ErrorAlertToast
        msg={e?.newMessage || "Internal Server Error"}
        redirectTo={"/"}
      />
    );
  }
}
