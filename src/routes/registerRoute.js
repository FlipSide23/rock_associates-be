import express from "express";
import UserCreated from "../controllers/registerController.js"


const router = express.Router()

router.post("/createUser", UserCreated.createNewUser)
router.get("/getRegisteredUsers", UserCreated.getAllUsers)
router.get("/verifyEmail", UserCreated.verifyEmail)
router.put("/assignUserRole/:id", UserCreated.assignUserRole)
router.get("/getSingleUser/:id", UserCreated.getUserById)


export default router