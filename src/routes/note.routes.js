import { Router } from "express";
import isLoggedIn from '../middlewares/auth.middlewares.js'


import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

const router = Router();

router.get("/get-notes/:projectId",isLoggedIn, getNotes);
router.get("/get-note-by-id/:noteId",isLoggedIn, getNoteById);
router.post("/create/:projectId",isLoggedIn, createNote);
router.put("/update/:noteId",isLoggedIn, updateNote);
router.delete("/delete/:noteId",isLoggedIn, deleteNote);

export default router;
