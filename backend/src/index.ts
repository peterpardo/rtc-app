require("dotenv").config();
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db";
import authRoutes from "./routes/auth.route";
import errorHandler from "./middleware/errorHandler";

const app = express();
const appRouter = express.Router();

const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

// group routes
appRouter.use("/auth", authRoutes);

// main route
app.use("/api", appRouter);

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
  connectDB();
});
