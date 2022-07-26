import express from "express";
import { getAll, createProject, getProject, deleteProject, patchProject } from "../controllers/projects.js";

const router = express.Router();

//all routes in here are starting with /projects
router.get("/", getAll);

router.post("/", createProject);

router.get("/:id", getProject);

router.delete("/:id", deleteProject);

router.patch("/:id", patchProject);

export default router;