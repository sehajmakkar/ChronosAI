import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";

const router = Router();

// register api
router.post(
  "/register",
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  userController.createUserController
);

export default router;
