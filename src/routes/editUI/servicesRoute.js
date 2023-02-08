import express from "express";
import servicesController from "../../controllers/editUI/servicesController.js";

const router = express.Router();


router.post("/addService", servicesController.addService);

router.get("/getAllServices", servicesController.getAllServices);

router.get("/getSingleService", servicesController.getSingleService);

router.put("/updateService", servicesController.updateService);

router.delete("/deleteService", servicesController.deleteService);


export default router;
