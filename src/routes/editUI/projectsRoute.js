import express from "express"
import projectsController from "../../controllers/editUI/projectsController.js";

const router = express.Router()

router.post("/createProject", projectsController.createProject);
router.get("/getAllProjects", projectsController.getAllProjects);
router.get("/getSingleProject", projectsController.getSingleProject);
router.get("/getProjectByCategory", projectsController.getProjectByCategory);
router.put("/updateProject", projectsController.updateProject);
router.delete("/deleteProject/:project_id", projectsController.deleteProject);


export default router