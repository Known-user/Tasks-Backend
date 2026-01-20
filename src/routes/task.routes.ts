import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.post("/:id/toggle", authenticate, toggleTask);

export default router;
