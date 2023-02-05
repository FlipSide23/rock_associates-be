import express from "express";
import experienceController from "../../controllers/editUI/experienceController.js";

const router = express.Router();


router.post("/addExperience", experienceController.addExperience);

router.get("/getExperience", experienceController.getExperience);

router.put("/updateExperience", experienceController.updateExperience);


export default router;
