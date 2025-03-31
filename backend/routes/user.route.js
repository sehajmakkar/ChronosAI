import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js";


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

// login api
router.post( 
  "/login",
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  userController.loginUserController
);

// profile api
router.get("/profile", authMiddleware.authUser, userController.ProfileController);

// logout api
// router.get("/logout", authMiddleware.authUser, userController.logoutController);

//get all users api
router.get("/all", authMiddleware.authUser, userController.getAllUsersController)

export default router;
