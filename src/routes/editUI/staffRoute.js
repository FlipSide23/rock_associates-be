import express from "express";
import staffController from "../../controllers/editUI/staffController.js";

const router = express.Router();


router.post("/addMember", staffController.addMember);

router.get("/getAllMembers", staffController.getAllMembers);

router.get("/getSingleMember", staffController.getSingleMember);

router.put("/updateMember", staffController.updateMember);

router.delete("/deleteMember", staffController.deleteMember);


export default router;
