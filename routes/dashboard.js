import express from "express";
import { getDashboard } from "../controllers/dashboard.js"; //commando de chamada para o dashboard

const router = express.Router();

//all routes in here are starting with /dashboard
router.get("/", getDashboard);

export default router;