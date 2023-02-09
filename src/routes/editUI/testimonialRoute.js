import express from "express";
import testimonialController from "../../controllers/editUI/testimonialController.js";

const router = express.Router();


router.post("/addTestimonial", testimonialController.addTestimonial);

router.get("/getAllTestimonials", testimonialController.getAllTestimonials);

router.get("/getSingleTestimonial", testimonialController.getSingleTestimonial);

router.put("/updateTestimonial", testimonialController.updateTestimonial);

router.delete("/deleteTestimonial", testimonialController.deleteTestimonial);


export default router;
