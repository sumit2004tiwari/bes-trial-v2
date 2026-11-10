import { EVENT_DATE, EVENT_YEAR, VENUE_DETAILS } from "@/app/backend/constant"
export const userEventTemplate=({
    href,
    urn,
    fullName
}: any)=>{
    return `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">

<!-- Container -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <tr>
                    <td align="left">
                       <p style="font-size: 16px; color: #555; line-height: 1.6;">
                           Dear ${fullName},
                        </p>
                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            We’re delighted to welcome you to <strong>BES EXPO ${EVENT_YEAR}</strong>, the most anticipated event of the year!
                        </p>
                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            This transformative expo brings together <strong>5,000+ exhibitors</strong>, 
                            <strong>6,000+ international buyers</strong> from <strong>110+ countries</strong>, 
                            and over <strong>120,000 visitors</strong> at <strong>${VENUE_DETAILS}</strong>, 
                            from <strong>${EVENT_DATE}</strong>.
                        </p>
                      

                        <!-- Next Step -->
                        <h2 style="color: #333; font-size: 20px; margin-bottom: 10px;">👉 Your Next Step:</h2>
                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            To ensure a smooth experience, download your badge today directly scanning qr code or by using your registration number.
                        </p>

                        <!-- Button and QR Code -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px; width: 100%;">
                            <tr>
                                <td align="left" style="padding-right: 15px;">
                                   
                                        <img src="cid:qr-code" alt="QR Code" style="width: 120px; height: 120px; border-radius: 4px;">
                                  
                                </td>
                                <td align="left" style="vertical-align: middle;">
                                    <a href="${href}" target="_blank" 
                                       style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 4px; line-height: 20px;">
                                        Download Your Badge Now
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <!-- Reference ID -->
                        <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 20px;">
                            <strong>Your Unique Reference ID:</strong> 
                            <span style="background-color: #e8f0fe; padding: 5px; border-radius: 4px; font-weight: bold; display: inline-block;">
                               ${urn}
                            </span>
                        </p>

                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            Join us to witness the future of textiles and make valuable connections that propel your business to new heights!
                        </p>

                        <!-- Event Details -->
                        <h2 style="color: #333; font-size: 20px; margin-bottom: 10px;">📅 Event Details:</h2>
                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            📅 <strong>${EVENT_DATE}</strong><br>
                            📍 <strong>${VENUE_DETAILS}</strong><br>
                            🌐 <a href="https://besindia.com/" target="_blank" style="color: #1a73e8; text-decoration: none;">Visit BES India Website</a>
                        </p>

                        <!-- Closing Note -->
                        <p style="font-size: 16px; color: #555; line-height: 1.6;">
                            We look forward to welcoming you to this iconic event!
                        </p>

                        <!-- Footer -->
                        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
                            Warm regards,<br>
                            <strong>Team BES EXPO ${EVENT_YEAR}</strong>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>

`
}