import { EMAIL_TEMPLATE_LOGO_URL } from "@/app/backend/constant";

export const generateSignupTemplate = (link: any) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your login</title>
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
                      <div><img src="${EMAIL_TEMPLATE_LOGO_URL}" alt="Company" style="width: 100%;">
                      </div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                      <div style="color: #1f2937; text-align: left; font-size: 15px; line-height: 1.6;">
                        <h1 style="margin: 0 0 16px; font-size: 20px; line-height: 1.35; color: #111827; font-weight: 600;">Verification code</h1>
                        <p style="padding-bottom: 16px">Please use the verification link below to sign in.</p>
                      <div style="text-align: center; padding: 8px 0 20px;">
                        <a href="${link}" style="text-decoration: none; padding: 12px 28px; background: #2563eb; color: #ffffff; border-radius: 8px; font-weight: 600; display: inline-block;">Confirm Account</a>
                      </div>
                        <br>
                        <br>

                        <a href="${link}">${link}</a>
                        <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                        <p style="padding-bottom: 16px">Thanks,<br>The Bes team</p>
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
