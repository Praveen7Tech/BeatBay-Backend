import z from "zod";

export const EditProfileSchema = z.object({
  name: z.string().min(2, "name is required").optional(),
  password: z.string().min(6, "password must be at least 6 characters").optional(),
  profileImage: z.string().min(1, "image must be needed").optional()
});