// Email template generators matching the music app theme
// Dark background with green accents (#1DB954)

const colors = {
  primary: '#1DB954',
  background: '#121212',
  surface: '#1a1a1a',
  surfaceHover: '#282828',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textSecondary: '#b3b3b3',
  border: '#2a2a2a',
};

const baseStyles = `
  body { margin: 0; padding: 0; background-color: ${colors.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
  .card { background-color: ${colors.surface}; border-radius: 16px; padding: 40px 32px; border: 1px solid ${colors.border}; }
  .heading { color: ${colors.text}; font-size: 28px; font-weight: 700; margin: 0 0 8px; text-align: center; }
  .subheading { color: ${colors.textMuted}; font-size: 16px; margin: 0 0 32px; text-align: center; line-height: 24px; }
  .otp-container { background-color: ${colors.surfaceHover}; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
  .otp-label { color: ${colors.textMuted}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; }
  .otp-code { color: ${colors.primary}; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: 'SF Mono', Monaco, 'Roboto Mono', monospace; }
  .button { display: inline-block; background-color: ${colors.primary}; color: #000000; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 500px; text-decoration: none; text-align: center; width: 100%; box-sizing: border-box; }
  .button-container { text-align: center; margin: 32px 0; }
  .text-center { color: ${colors.textSecondary}; font-size: 14px; line-height: 24px; text-align: center; margin: 16px 0; }
  .text-muted { color: ${colors.textMuted}; font-size: 13px; text-align: center; }
  .divider { border: none; border-top: 1px solid ${colors.border}; margin: 32px 0; }
  .footer { color: ${colors.textMuted}; font-size: 12px; line-height: 20px; text-align: center; margin: 32px 0 0; }
  .footer a { color: ${colors.textMuted}; text-decoration: underline; }
  .link { color: ${colors.primary}; text-decoration: underline; }
  .expiry-badge { background-color: ${colors.surfaceHover}; border-radius: 20px; color: ${colors.textMuted}; display: inline-block; font-size: 12px; padding: 6px 16px; }
  .link-box { background-color: ${colors.surfaceHover}; padding: 12px 16px; border-radius: 8px; word-break: break-all; font-size: 12px; text-align: center; margin: 12px 0; }
  .feature-row { padding: 8px 0; color: ${colors.text}; font-size: 14px; }
`;

const logoSection = (appName: string = 'Soundwave') => `
  <div style="text-align: center; margin-bottom: 32px;">
    <div style="width: 56px; height: 56px; background-color: ${colors.primary}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
      <span style="font-size: 24px;">🎵</span>
    </div>
    <p style="color: ${colors.text}; font-size: 24px; font-weight: 700; margin: 16px 0 0; letter-spacing: -0.5px;">
      ${appName}
    </p>
  </div>
`;

const footerSection = (appName: string = 'Soundwave') => `
  <div class="footer">
    <p style="margin: 0 0 8px;">© 2024 ${appName}. All rights reserved.</p>
    <p style="margin: 0;">
      <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a> · <a href="#">Help Center</a>
    </p>
  </div>
`;

interface OTPEmailParams {
  otpCode: string;
  userName?: string;
  expiryMinutes?: number;
  appName?: string;
}

export function generateOTPEmail({
  otpCode,
  userName = 'there',
  expiryMinutes = 10,
  appName = 'Soundwave',
}: OTPEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    ${logoSection(appName)}
    
    <div class="card">
      <h1 class="heading">Verify your email</h1>
      <p class="subheading">Hey ${userName}, use the code below to complete your verification</p>
      
      <div class="otp-container">
        <p class="otp-label">Verification Code</p>
        <p class="otp-code">${otpCode}</p>
      </div>
      
      <p class="text-center">
        This code will expire in <span style="color: ${colors.primary}; font-weight: 600;">${expiryMinutes} minutes</span>
      </p>
      
      <hr class="divider">
      
      <p class="text-muted">
        If you didn't request this code, you can safely ignore this email. Someone might have entered your email by mistake.
      </p>
    </div>
    
    ${footerSection(appName)}
  </div>
</body>
</html>
  `.trim();
}

interface MagicLinkEmailParams {
  magicLink: string;
  userName?: string;
  expiryMinutes?: number;
  appName?: string;
  actionType?: 'login' | 'signup' | 'reset';
}

const actionConfig = {
  login: {
    title: 'Sign in to your account',
    subtitle: 'Click the button below to securely sign in',
    buttonText: 'Sign In Now',
  },
  signup: {
    title: 'Welcome to the music!',
    subtitle: 'Click the button below to verify your email and get started',
    buttonText: 'Verify Email',
  },
  reset: {
    title: 'Reset your password',
    subtitle: 'Click the button below to set a new password',
    buttonText: 'Reset Password',
  },
};

export function generateMagicLinkEmail({
  magicLink,
  userName = 'there',
  expiryMinutes = 60,
  appName = 'Soundwave',
  actionType = 'login',
}: MagicLinkEmailParams): string {
  const config = actionConfig[actionType];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    ${logoSection(appName)}
    
    <div class="card">
      <h1 class="heading">${config.title}</h1>
      <p class="subheading">Hey ${userName}, ${config.subtitle.toLowerCase()}</p>
      
      <div class="button-container">
        <a href="${magicLink}" class="button">${config.buttonText}</a>
      </div>
      
      <div style="text-align: center;">
        <span class="expiry-badge">⏱ Expires in ${expiryMinutes} minutes</span>
      </div>
      
      <hr class="divider">
      
      <p class="text-muted">If the button doesn't work, copy and paste this link into your browser:</p>
      <div class="link-box">
        <a href="${magicLink}" class="link">${magicLink}</a>
      </div>
      
      <p class="text-muted" style="margin-top: 24px;">
        If you didn't request this link, you can safely ignore this email.
      </p>
    </div>
    
    ${footerSection(appName)}
  </div>
</body>
</html>
  `.trim();
}

interface WelcomeEmailParams {
  userName?: string;
  appName?: string;
  dashboardUrl?: string;
}

export function generateWelcomeEmail({
  userName = 'there',
  appName = 'Soundwave',
  dashboardUrl = 'https://example.com/dashboard',
}: WelcomeEmailParams): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${appName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    ${logoSection(appName)}
    
    <div class="card">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">🎉</span>
      </div>
      
      <h1 class="heading">Welcome aboard, ${userName}!</h1>
      <p class="subheading">
        Your account has been successfully created. Get ready to discover amazing music and connect with artists worldwide.
      </p>
      
      <div style="background-color: ${colors.surfaceHover}; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div class="feature-row">🎧 Stream unlimited music</div>
        <div class="feature-row">📱 Create your playlists</div>
        <div class="feature-row">🎤 Follow your favorite artists</div>
        <div class="feature-row">🌐 Join listening rooms</div>
      </div>
      
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">Start Exploring</a>
      </div>
      
      <hr class="divider">
      
      <p class="text-muted">
        Have questions? Our support team is always here to help you get the most out of ${appName}.
      </p>
    </div>
    
    ${footerSection(appName)}
  </div>
</body>
</html>
  `.trim();
}
