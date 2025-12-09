export function otpEmailTemplate(otp: string) {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f7f7f7;
    padding: 20px;
  ">
    <div style="
      max-width: 500px;
      margin: auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    ">
      <h2 style="
        color: #333333;
        text-align: center;
      ">
        Your OTP Code
      </h2>

      <p style="
        font-size: 16px;
        color: #555555;
      ">
        Use the following one-time password to complete your verification:
      </p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        text-align: center;
        padding: 10px;
        margin: 20px 0;
        color: #2d6cdf;
        border: 2px dashed #2d6cdf;
        border-radius: 8px;
        background: #f0f6ff;
      ">
        ${otp}
      </div>

      <p style="
        font-size: 14px;
        color: #777777;
      ">
        This OTP is valid for <strong>5 minutes</strong>.  
        If you did not request this, please ignore this email.
      </p>

      <p style="
        text-align: center;
        margin-top: 30px;
        font-size: 14px;
        color: #aaaaaa;
      ">
        © ${new Date().getFullYear()} DURIO. All rights reserved.
      </p>
    </div>
  </div>
  `;
}
