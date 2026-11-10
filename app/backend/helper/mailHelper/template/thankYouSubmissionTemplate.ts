import { EMAIL_TEMPLATE_LOGO_URL } from "@/app/backend/constant";
import { EXPO_NAME } from "@/app/config/expo";

type ThankYouType = "visitor" | "delegate" | "book_my_space";

const TYPE_LABEL: Record<ThankYouType, string> = {
  visitor: "visitor registration",
  delegate: "delegate registration",
  book_my_space: "space booking request",
};

export const thankYouSubmissionTemplate = ({
  name,
  urn,
  type,
  downloadUrl,
}: {
  name: string;
  urn: string;
  type: ThankYouType;
  downloadUrl?: string;
}) => {
  const safeName = name || "";
  const safeUrn = urn || "";
  const label = TYPE_LABEL[type] || "submission";

  const badgeNote = downloadUrl
    ? `<p style="padding-bottom: 16px">You will receive your visitor badge on your email shortly. Not received yet? <a href="${downloadUrl}" style="color: #2563eb; text-decoration: underline;">download it from here</a>.</p>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you - ${EXPO_NAME}</title>
  <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>

<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation"
    style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" style="max-width: 458px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: left;">
                    <div><img src="${EMAIL_TEMPLATE_LOGO_URL}" alt="Company" style="min-width: 56px;"></div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <div style="color: #1f2937; text-align: left; font-size: 15px; line-height: 1.6;">
                      <h1 style="margin: 0 0 16px; font-size: 20px; line-height: 1.35; color: #111827; font-weight: 600;">Thank you, ${safeName}!</h1>
                      <p style="padding-bottom: 16px">Thank you for submitting your <strong>${label}</strong> with <strong>${EXPO_NAME}</strong>. Your request has been received successfully.</p>
                      <p style="padding-bottom: 16px"><strong>Your Registration No.</strong> ${safeUrn}</p>
                      ${badgeNote}
                      <p style="padding-bottom: 16px">If you have any questions, feel free to reach out to our team.</p>
                      <p style="padding-bottom: 16px">See you at the expo!</p>
                      <p>Thanks,<br>The ${EXPO_NAME} team</p>
                    </div>
                  </div>
                  <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`;
};
