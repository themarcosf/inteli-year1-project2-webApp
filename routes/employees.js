import express from "express";
import { getAll, createEmployee, getEmployee, deleteEmployee, patchEmployee } from "../controllers/employees.js";

const router = express.Router();

//all routes in here are starting with /employees
router.get("/", getAll);

router.post("/", createEmployee);

router.get("/:id", getEmployee);

router.delete("/:id", deleteEmployee);

router.patch("/:id", patchEmployee);

export default router;