import express, { Request, Response } from "express";
import User from "../models/user.model";

const router = express.Router();

interface UserBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

router.post(
  "/signup",
  async (req: Request<{}, {}, UserBody>, res: Response): Promise<any> => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    try {
      if (!email || !firstName || !lastName || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be atleast 6 characters" });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Passwords do not match. Please try again." });
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

module.exports = router;
