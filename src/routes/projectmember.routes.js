import { Router } from "express";

import {
  addMemberToProject,
  deleteMember,
  getProjectMembers,
  updateMemberRole,
  updateProjectMember,
} from "../controllers/projectmember.controllers.js";

import isLoggedIn from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/add-member/:projectId", isLoggedIn, addMemberToProject);
router.post("/get-members/:projectId", isLoggedIn, getProjectMembers);
router.put("/update-member/:projectId", isLoggedIn, updateProjectMember);
router.put("/update-member-role/:projectId", isLoggedIn, updateMemberRole);
router.delete("/delete-member/:projectId", isLoggedIn, deleteMember);

export default router;
