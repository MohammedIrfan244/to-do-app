
export function magicLinkTemplate(link: string) {
  return `
  <div style="
    width: 100%;
    background-color: #f7f7f9;
    padding: 30px 0;
    font-family: Arial, sans-serif;
  ">
    <div style="
      max-width: 520px;
      background: #ffffff;
      margin: auto;
      padding: 32px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    ">
      
      <h2 style="
        text-align: center;
        color: #222;
        margin-top: 0;
      ">
        🔐 Sign in to your account
      </h2>

      <p style="
        color: #444;
        font-size: 15px;
        margin-top: 16px;
        line-height: 1.5;
      ">
        Click the button below to securely sign in.  
        This magic link is valid for <strong>10 minutes</strong>.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${link}" style="
          display: inline-block;
          background-color: #2d6cdf;
          color: white;
          padding: 12px 22px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 16px;
          font-weight: bold;
        ">
          Sign in → 
        </a>
      </div>

      <p style="
        color: #666;
        font-size: 13px;
        line-height: 1.4;
      ">
        If the button doesn’t work, copy and paste the following link into your browser:
      </p>

      <p style="
        font-size: 13px;
        color: #2d6cdf;
        word-break: break-all;
        margin-top: 10px;
      ">
        ${link}
      </p>

      <p style="
        text-align: center;
        color: #aaa;
        font-size: 12px;
        margin-top: 32px;
      ">
        © ${new Date().getFullYear()} DURIO. All rights reserved.
      </p>

    </div>
  </div>
  `;
}
