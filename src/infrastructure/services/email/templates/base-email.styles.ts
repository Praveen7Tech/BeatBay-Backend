// Email template styles matching the music app theme
// Dark background with green accents (#1DB954 / hsl(141, 76%, 48%))

export const colors = {
  primary: '#1DB954',
  primaryDark: '#169c46',
  background: '#121212',
  surface: '#1a1a1a',
  surfaceHover: '#282828',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textSecondary: '#b3b3b3',
  border: '#2a2a2a',
};

export const main = {
  backgroundColor: colors.background,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

export const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

export const logo = {
  margin: '0 auto 32px',
  display: 'block',
};

export const card = {
  backgroundColor: colors.surface,
  borderRadius: '16px',
  padding: '40px 32px',
  border: `1px solid ${colors.border}`,
};

export const heading = {
  color: colors.text,
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

export const subheading = {
  color: colors.textMuted,
  fontSize: '16px',
  margin: '0 0 32px',
  textAlign: 'center' as const,
  lineHeight: '24px',
};

export const otpContainer = {
  backgroundColor: colors.surfaceHover,
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

export const otpCode = {
  color: colors.primary,
  fontSize: '36px',
  fontWeight: '700',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
};

export const otpLabel = {
  color: colors.textMuted,
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 12px',
};

export const button = {
  backgroundColor: colors.primary,
  borderRadius: '500px',
  color: '#000000',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '700',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '100%',
  boxSizing: 'border-box' as const,
};

export const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

export const text = {
  color: colors.textSecondary,
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
};

export const textCenter = {
  ...text,
  textAlign: 'center' as const,
};

export const link = {
  color: colors.primary,
  textDecoration: 'underline',
};

export const divider = {
  borderTop: `1px solid ${colors.border}`,
  margin: '32px 0',
};

export const footer = {
  color: colors.textMuted,
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '32px 0 0',
};

export const footerLink = {
  color: colors.textMuted,
  textDecoration: 'underline',
};

export const expiryBadge = {
  backgroundColor: colors.surfaceHover,
  borderRadius: '20px',
  color: colors.textMuted,
  display: 'inline-block',
  fontSize: '12px',
  padding: '6px 16px',
  margin: '16px 0 0',
};

export const iconContainer = {
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

export const musicIcon = {
  width: '64px',
  height: '64px',
  backgroundColor: colors.primary,
  borderRadius: '50%',
  display: 'inline-block',
  lineHeight: '64px',
  textAlign: 'center' as const,
};
