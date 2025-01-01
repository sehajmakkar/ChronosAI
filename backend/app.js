import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
connectDB();
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
})

// user routes
// /users/register
// /users/login
// /users/logout
// /users/profile
app.use("/users", userRouter);

export default app;