import express, { Request, Response } from "express";
import User from "../models/user.model";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { LoginBody, SignupBody } from "../types/auth";
import bcrypt from "bcrypt";

const router = express.Router();

router.post(
  "/signup",
  async (req: Request<{}, {}, SignupBody>, res: Response): Promise<any> => {
    try {
      const { success, error, data } = signupSchema.safeParse(req.body);

      if (!success) {
        res.status(400).json({ message: error.format() });
        return;
      }

      const { email, firstName, lastName, password } = data;
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

router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response): Promise<any> => {
    try {
      const { success, error, data } = loginSchema.safeParse(req.body);

      if (!success) {
        return res.status(400).json({ message: error?.format() });
      }

      const { email, password } = data;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        return res.json({ message: "Successfully logged in.", data: user });
      } else {
        return res.json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.log("Login error ", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
