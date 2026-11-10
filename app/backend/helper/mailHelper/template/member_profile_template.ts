import { EMAIL_TEMPLATE_LOGO_URL } from "@/app/backend/constant";

const wrap = (content: string) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Member Profile Status</title>
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
                    <div><img src="${EMAIL_TEMPLATE_LOGO_URL}" alt="Company" style="width: 100%;">
                    </div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <div style="color: #1f2937; text-align: left; font-size: 15px; line-height: 1.6;">
                      ${content}
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

export const generateMemberApprovedTemplate = (userName: string, membershipNo?: string) =>
  wrap(`<h1 style="margin: 0 0 16px; font-size: 20px; line-height: 1.35; color: #111827; font-weight: 600;">Profile Approved</h1>
    <p style="padding-bottom: 16px">Dear ${userName},</p>
    <p style="padding-bottom: 16px">Congratulations! Your member profile${
      membershipNo ? ` (${membershipNo})` : ""
    } has been <strong>approved</strong>.</p>
    <p style="padding-bottom: 16px">Thank you for being a part of Bes.</p>
    <p style="padding-bottom: 16px">Thanks,<br>The Bes team</p>`);

export const generateMemberRejectedTemplate = (
  userName: string,
  reason: string
) =>
  wrap(`<h1 style="margin: 0 0 16px; font-size: 20px; line-height: 1.35; color: #111827; font-weight: 600;">Profile Rejected</h1>
    <p style="padding-bottom: 16px">Dear ${userName},</p>
    <p style="padding-bottom: 16px">We are sorry to inform you that your member profile has been <strong>rejected</strong>.</p>
    <p style="padding-bottom: 16px">Reason: ${reason}</p>
    <p style="padding-bottom: 16px">Please update and resubmit your details.</p>
    <p style="padding-bottom: 16px">Thanks,<br>The Bes team</p>`);
