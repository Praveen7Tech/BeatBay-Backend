
export const EmailFormat = {
    otp: (otp: string) => ({
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It expires in 2 minutes.`,
        html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 2 minutes.</p>`
    }),
}