import express from "express";
import aboutController from "../../controllers/editUI/aboutController.js";

const router = express.Router();


router.post("/addAbout", aboutController.addAbout);

router.get("/getAbout", aboutController.getAbout);

router.put("/updateAbout", aboutController.updateAbout);


export default router;
