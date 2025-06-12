import { Router } from "express";
import { addMemberToProject, getProjectMembers } from "../controllers/projectmember.controllers.js"
import isLoggedIn from "../middlewares/auth.middlewares.js";

const router = Router()

router.post("/add-member-to-project/:projectId", isLoggedIn, addMemberToProject)
router.post("/get-project-member/:projectId", isLoggedIn, getProjectMembers)

export default router