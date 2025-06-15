import { Router } from "express";
import {} from "../controllers/task.controllers.js";
import isLoggedIn from "../middlewares/auth.middlewares";
import { validateProjectIdAndRole } from "../middlewares/validateProject.middleware";

const router = Router();

router.post(
  "/create-task/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  createTask,
);

router.post("/get-tasks/:projectId", isLoggedIn, getTasks);
router.post("/get-task-by-id/:taskId", isLoggedIn, getTaskById);
router.put("/update-task/:taskId", isLoggedIn, updateTask);
router.delete("/delete-task/:taskId", isLoggedIn, deleteTask);
router.put("/update-task-status/:taskId", isLoggedIn, updateTaskStatus);

export default router;
