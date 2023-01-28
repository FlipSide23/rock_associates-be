import express from "express";
import subscriptionController from "../controllers/subscriptionController.js";

const router = express.Router();


router.post("/Subscribe", subscriptionController.Subscribe);

router.get("/getAllSubscriptions", subscriptionController.getAllSubscriptions);

router.delete("/deleteSubscriber/:subscription_id", subscriptionController.deleteSubscriber);

router.get("/verifyEmail", subscriptionController.verifyEmail)

router.get("/getSubscriberById/:subscription_id", subscriptionController.getSubscriberById);

export default router;
