import express from "express";
import staffController from "../../controllers/editUI/staffController.js";

const router = express.Router();


router.post("/addMember", staffController.addMember);

router.get("/getAllMembers", staffController.getAllMembers);

// router.delete("/deleteMessage/:message_id", contactController.deleteMessage);

// router.put("/replyMessage/:message_id", contactController.replyMessage);

// router.get("/getMessageById/:message_id", contactController.getMessageById);

export default router;
