import z from "zod";

export const signupSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match. Please try again.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
