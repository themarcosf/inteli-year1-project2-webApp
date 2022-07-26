import express from "express";
import cors from "cors";

import employeesRoutes from "./routes/employees.js";
import projectsRoutes from "./routes/projects.js";
import dashboardRoutes from "./routes/dashboard.js";


//server settings
const app = express();
const hostname = '127.0.0.1';
const PORT = 3000;

app.use(express.static("src/frontend"));
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use("/employees", employeesRoutes);
app.use("/projects", projectsRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, () => console.log(`Server running on http://${hostname}:${PORT}`));

var a;