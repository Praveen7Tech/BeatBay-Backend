
import z from "zod";

export const nameValidator = z.string().min(2, "Name must be at least 2 characters.")

export const emailValidator = z.string().email("Invalid email")

export const LoginPassValidator = z.string().min(6, "Password must be at least 6 characters.")

export const passwordValidator = z.string()
.min(6, "Password must be at least 6 characters.")
.regex(/(?=.*\d)/, "Must include at least one number")
.regex(/(?=.*[A-Z])/, "Must include at least one uppercase letter")

export const bio = z.string().min(10, "Bio must be atleast 10 letter length")

export const otpValidator = z.string().min(4, "OTP is required")

export const tokenValidator = z.string().min(1, "token is required")