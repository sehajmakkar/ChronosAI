import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
connectDB();
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
      'https://chronos-ai-seven.vercel.app',
      'http://localhost:3000', 
      'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
})

// user routes
// /users/register
// /users/login
// /users/logout
// /users/profile
// /users/getAllUsers
app.use("/users", userRouter);

// project routes
// /projects/create
// /projects/all
// /projects/add-user
app.use("/projects", projectRouter);

// ai routes
// /ai/get-result
app.use("/ai", aiRouter);


export default app;