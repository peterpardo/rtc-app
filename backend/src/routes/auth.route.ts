import express, { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { LoginBody, SignupBody, ApiResponse } from "../types/auth";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/signup",
  async (
    req: Request<{}, {}, SignupBody>,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { success, error, data } = signupSchema.safeParse(req.body);

      if (!success) {
        throw new AppError({ message: error.format() }, 400);
      }

      const { email, firstName, lastName, password } = data;
      const user = await User.findOne({ email });

      if (user) {
        throw new AppError({ message: "Email already exists" }, 400);
      }

      const newUser = new User({ email, firstName, lastName, password });

      if (newUser) {
        await newUser.save();
        return res.json({ status: "success", data: newUser });
      } else {
        throw new AppError({ message: "Invalid user data" }, 400);
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
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { success, error, data } = loginSchema.safeParse(req.body);

      if (!success) {
        throw new AppError({ message: error.format() }, 400);
      }

      const { email, password } = data;
      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError({ message: "Invalid Email" }, 400);
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET || "default_secret_key",
          {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
          }
        );

        return res.json({ status: "success", data: { user, token } });
      } else {
        throw new AppError({ message: "Invalid Credentials" }, 400);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
