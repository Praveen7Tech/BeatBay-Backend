// import {
//   Body,
//   Container,
//   Head,
//   Heading,
//   Html,
//   Preview,
//   Section,
//   Text,
//   Hr,
// } from '@react-email/components';
// import * as React from 'react';
// import * as styles from './base-email.styles';

// interface OTPEmailProps {
//   otpCode: string;
//   userName?: string;
//   expiryMinutes?: number;
//   appName?: string;
// }

// export const OTPEmail = ({
//   otpCode = '123456',
//   userName = 'there',
//   expiryMinutes = 10,
//   appName = 'Soundwave',
// }: OTPEmailProps) => (
//   <Html>
//     <Head />
//     <Preview>Your verification code: {otpCode}</Preview>
//     <Body style={styles.main}>
//       <Container style={styles.container}>
//         {/* Logo/Brand Section */}
//         <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
//           <div
//             style={{
//               width: '56px',
//               height: '56px',
//               backgroundColor: styles.colors.primary,
//               borderRadius: '50%',
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto',
//             }}
//           >
//             <span style={{ fontSize: '24px' }}>🎵</span>
//           </div>
//           <Text
//             style={{
//               color: styles.colors.text,
//               fontSize: '24px',
//               fontWeight: '700',
//               margin: '16px 0 0',
//               letterSpacing: '-0.5px',
//             }}
//           >
//             {appName}
//           </Text>
//         </Section>

//         {/* Main Card */}
//         <Section style={styles.card}>
//           <Heading style={styles.heading}>Verify your email</Heading>
//           <Text style={styles.subheading}>
//             Hey {userName}, use the code below to complete your verification
//           </Text>

//           {/* OTP Display */}
//           <Section style={styles.otpContainer}>
//             <Text style={styles.otpLabel}>Verification Code</Text>
//             <Text style={styles.otpCode}>{otpCode}</Text>
//           </Section>

//           <Text style={styles.textCenter}>
//             This code will expire in{' '}
//             <span style={{ color: styles.colors.primary, fontWeight: '600' }}>
//               {expiryMinutes} minutes
//             </span>
//           </Text>

//           <Hr style={styles.divider} />

//           <Text
//             style={{
//               ...styles.textCenter,
//               fontSize: '13px',
//               color: styles.colors.textMuted,
//             }}
//           >
//             If you didn't request this code, you can safely ignore this email.
//             Someone might have entered your email by mistake.
//           </Text>
//         </Section>

//         {/* Footer */}
//         <Section style={styles.footer}>
//           <Text style={{ margin: '0 0 8px' }}>
//             © 2024 {appName}. All rights reserved.
//           </Text>
//           <Text style={{ margin: 0 }}>
//             <a href="#" style={styles.footerLink}>
//               Privacy Policy
//             </a>
//             {' · '}
//             <a href="#" style={styles.footerLink}>
//               Terms of Service
//             </a>
//             {' · '}
//             <a href="#" style={styles.footerLink}>
//               Help Center
//             </a>
//           </Text>
//         </Section>
//       </Container>
//     </Body>
//   </Html>
// );

// export default OTPEmail;
