// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Heading,
//   Html,
//   Preview,
//   Section,
//   Text,
//   Hr,
//   Link,
// } from '@react-email/components';
// import * as React from 'react';
// import * as styles from './base-email-styles';

// interface MagicLinkEmailProps {
//   magicLink: string;
//   userName?: string;
//   expiryMinutes?: number;
//   appName?: string;
//   actionType?: 'login' | 'signup' | 'reset';
// }

// const actionConfig = {
//   login: {
//     title: 'Sign in to your account',
//     subtitle: 'Click the button below to securely sign in',
//     buttonText: 'Sign In Now',
//     preview: 'Your sign-in link is ready',
//   },
//   signup: {
//     title: 'Welcome to the music!',
//     subtitle: 'Click the button below to verify your email and get started',
//     buttonText: 'Verify Email',
//     preview: 'Verify your email to get started',
//   },
//   reset: {
//     title: 'Reset your password',
//     subtitle: 'Click the button below to set a new password',
//     buttonText: 'Reset Password',
//     preview: 'Reset your password',
//   },
// };

// export const MagicLinkEmail = ({
//   magicLink = 'https://example.com/auth/verify?token=xxx',
//   userName = 'there',
//   expiryMinutes = 60,
//   appName = 'Soundwave',
//   actionType = 'login',
// }: MagicLinkEmailProps) => {
//   const config = actionConfig[actionType];

//   return (
//     <Html>
//       <Head />
//       <Preview>{config.preview}</Preview>
//       <Body style={styles.main}>
//         <Container style={styles.container}>
//           {/* Logo/Brand Section */}
//           <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
//             <div
//               style={{
//                 width: '56px',
//                 height: '56px',
//                 backgroundColor: styles.colors.primary,
//                 borderRadius: '50%',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto',
//               }}
//             >
//               <span style={{ fontSize: '24px' }}>🎵</span>
//             </div>
//             <Text
//               style={{
//                 color: styles.colors.text,
//                 fontSize: '24px',
//                 fontWeight: '700',
//                 margin: '16px 0 0',
//                 letterSpacing: '-0.5px',
//               }}
//             >
//               {appName}
//             </Text>
//           </Section>

//           {/* Main Card */}
//           <Section style={styles.card}>
//             <Heading style={styles.heading}>{config.title}</Heading>
//             <Text style={styles.subheading}>
//               Hey {userName}, {config.subtitle.toLowerCase()}
//             </Text>

//             {/* CTA Button */}
//             <Section style={styles.buttonContainer}>
//               <Button href={magicLink} style={styles.button}>
//                 {config.buttonText}
//               </Button>
//             </Section>

//             {/* Expiry Badge */}
//             <Section style={{ textAlign: 'center' }}>
//               <span style={styles.expiryBadge}>
//                 ⏱ Expires in {expiryMinutes} minutes
//               </span>
//             </Section>

//             <Hr style={styles.divider} />

//             {/* Alternative Link */}
//             <Text
//               style={{
//                 ...styles.textCenter,
//                 fontSize: '13px',
//                 color: styles.colors.textMuted,
//               }}
//             >
//               If the button doesn't work, copy and paste this link into your
//               browser:
//             </Text>
//             <Text
//               style={{
//                 ...styles.textCenter,
//                 fontSize: '12px',
//                 wordBreak: 'break-all',
//                 backgroundColor: styles.colors.surfaceHover,
//                 padding: '12px 16px',
//                 borderRadius: '8px',
//                 margin: '12px 0',
//               }}
//             >
//               <Link href={magicLink} style={{ color: styles.colors.primary }}>
//                 {magicLink}
//               </Link>
//             </Text>

//             <Text
//               style={{
//                 ...styles.textCenter,
//                 fontSize: '13px',
//                 color: styles.colors.textMuted,
//                 marginTop: '24px',
//               }}
//             >
//               If you didn't request this link, you can safely ignore this email.
//             </Text>
//           </Section>

//           {/* Footer */}
//           <Section style={styles.footer}>
//             <Text style={{ margin: '0 0 8px' }}>
//               © 2024 {appName}. All rights reserved.
//             </Text>
//             <Text style={{ margin: 0 }}>
//               <a href="#" style={styles.footerLink}>
//                 Privacy Policy
//               </a>
//               {' · '}
//               <a href="#" style={styles.footerLink}>
//                 Terms of Service
//               </a>
//               {' · '}
//               <a href="#" style={styles.footerLink}>
//                 Help Center
//               </a>
//             </Text>
//           </Section>
//         </Container>
//       </Body>
//     </Html>
//   );
// };

// export default MagicLinkEmail;
