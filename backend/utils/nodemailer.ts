import nodemailer from "nodemailer";

export async function sendOtpMail(email: string, otp: number) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SPC - OTP Verification.",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure OTP Verification</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .otp-box { background-color: #153aa1; border-radius: 5px; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: white; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Secure OTP Verification</h1>
        </div>
        <p>Dear User,</p>
        <p>Your OTP code is:</p>
        <div class="otp-box">${otp}</div>
        <p>Please use this code to complete your verification process.</p>
        <div class="footer">
            <p>Thank you for choosing SPC!</p>
            <p>&copy; 2025 SPC</p>
        </div>
    </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
