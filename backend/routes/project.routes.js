import { Router } from "express";
import { body } from "express-validator";
import * as projectController from "../controllers/project.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("name").isString().withMessage("Name is required"),
  projectController.createProject
);

router.get("/all", authMiddleware.authUser, projectController.getAllProjects);

router.put(
  "/add-user",
  authMiddleware.authUser,
  projectController.addUserToProject
);

router.get(
  "/get-project/:projectId",
  authMiddleware.authUser,
  projectController.getProjectById
)

router.put('/update-file-tree', authMiddleware.authUser,
   body("fileTree").isString().withMessage("File tree is required"),
   body("projectId").isString().withMessage("Project ID is required"),
   projectController.updateFileTree)

router.post('/messages', authMiddleware.authUser, projectController.addMessage)
router.get('/messages/:projectId', authMiddleware.authUser, projectController.getMessages)

export default router;
