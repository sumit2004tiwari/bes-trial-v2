import emailMask from "email-mask";
import { getUserDetailFromEmail } from "@/app/backend/action/getUserDetails";
import DownloadBadgePage from "./component/download-badge-page";
import EmailAddressBox from "./component/email-address-box";
import EmailVerifingBox from "./component/email-verified";
import { redirect } from "next/navigation";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

const BADGE_EMAIL_PAGE = "/registrationform/e-badges/download-badge";

export default async function page(req: any) {
  let { slug } = await req.params;
  const [slug1] = slug || [];
  if (slug1) {
    const jwtService = new JwtTokenService();
    const isValid = await jwtService.verifyToken(slug1);
    if (!isValid) {
      return redirect(BADGE_EMAIL_PAGE);
    }
    const decoded: any = await jwtService.decodeToken(slug1);
    const email = decoded?.email;
    if (!email) {
      return redirect(BADGE_EMAIL_PAGE);
    }

    let data;
    try {
      data = await getUserDetailFromEmail(email);
    } catch (e) {
      return redirect(BADGE_EMAIL_PAGE);
    }

    const maskedEmail: any = emailMask(email);

    return (
      <DownloadBadgePage>
        <EmailVerifingBox
          token={slug1}
          maskedEmail={maskedEmail}
          urn={data?.unique_reference_number}
        />
      </DownloadBadgePage>
    );
  }
  // if slug is not found then show email address input field
  // and send otp to email address
  // verify then redirect with token (which expire in 15 minutes)

  return (
    <DownloadBadgePage>
      <EmailAddressBox />
    </DownloadBadgePage>
  );
}
