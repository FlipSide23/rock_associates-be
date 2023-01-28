import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();


router.post("/sendMessage", contactController.sendMessage);

router.get("/getAllMessages", contactController.getAllMessages);

router.delete("/deleteMessage/:message_id", contactController.deleteMessage);

router.put("/replyMessage/:message_id", contactController.replyMessage);

router.get("/getMessageById/:message_id", contactController.getMessageById);

export default router;
