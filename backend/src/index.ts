require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/db");

const app = express();
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

app.use("/api/auth", require("./routes/auth.route"));

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
  connectDB();
});
