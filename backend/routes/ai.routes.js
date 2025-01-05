import {Router} from "express";
const router = Router();

import * as aiController from "../controllers/ai.controller.js";

router.get("/get-result", aiController.getResult);



export default router;