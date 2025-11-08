
export const EmailFormat = {
    otp: (otp: string) => ({
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It expires in 2 minutes.`,
        html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 2 minutes.</p>`
    }),
}

export const passwordResetFormat = {
    link: (resetLink: string)=> ({
        subject: "Password Reset Request.",
        text: "Use this link to reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })
}