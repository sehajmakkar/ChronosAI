import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
connectDB();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./routes/user.route.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
})

// register : /users/register
app.use("/users", userRouter);

export default app;