import z from "zod";

export const EditProfileSchema = z.object({
  name: z.string().min(2, "name is required").optional(),
  bio: z.string().min(10, "Bio must be atleast 10 charecters").optional(),
  // password: z.string().min(6, "password must be at least 6 characters").optional(),
  profileImage: z.string().min(1, "image must be needed").optional()
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "password must be at least 6 characters"),
  newPassword: z.string().min(6, "password must be at least 6 characters")
})