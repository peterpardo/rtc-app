import express, { Request, Response } from "express";
import { z } from "zod";
import User from "../models/user.model";

const router = express.Router();

interface UserBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const userSchema = z
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

router.post(
  "/signup",
  async (req: Request<{}, {}, UserBody>, res: Response): Promise<any> => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    try {
      const result = userSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ message: result.error.format() });
        return;
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({ email, firstName, lastName, password });

      if (newUser) {
        await newUser.save();
        return res.json({ message: "Signup success.", user: newUser });
      } else {
        return res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup route", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

router.post("/login", async (req: Request<{}, {}, UserBody>, res: Response) => {
  const { email, password } = req.body;
  try {
    res.json({ message: "Login route" });
  } catch (error) {
    console.log("login error");
  }
});

export default router;
