import express, { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import {
  ApiResponse,
  LoginBody,
  SignupBody,
  SignupResponse,
} from "../types/auth";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/errorHandler";

const router = express.Router();

router.post(
  "/signup",
  async (
    req: Request<{}, {}, SignupBody>,
    res: Response<SignupResponse>,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { success, error, data } = signupSchema.safeParse(req.body);

      if (!success) {
        throw new AppError({ success: false, message: error.format() }, 400);
      }

      const { email, firstName, lastName, password } = data;
      const user = await User.findOne({ email });

      if (user) {
        throw new AppError(
          { success: false, message: "Email already exists" },
          400
        );
      }

      const newUser = new User({ email, firstName, lastName, password });

      if (newUser) {
        await newUser.save();
        return res.json({ success: true, data: newUser });
      } else {
        throw new AppError(
          { success: false, message: "Invalid user data" },
          400
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { success, error, data } = loginSchema.safeParse(req.body);

      if (!success) {
        throw new AppError({ success: false, message: error.format() }, 400);
      }

      const { email, password } = data;
      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError({ success: false, message: "Invalid Email" }, 400);
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        return res.json({ success: true, data: user });
      } else {
        throw new AppError(
          { success: false, message: "Invalid Credentials" },
          400
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
