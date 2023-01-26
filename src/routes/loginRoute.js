import express from "express"
import loginController from "../controllers/loginController.js"
import authentication from "../middlewares/authentication.js"


const router = express.Router()

router.post("/loginUser", loginController.loginUser)

router.get("/loggedInUser", authentication.authLogin, loginController.loggedInUser)

router.post("/forgotPassword", loginController.forgotPassword)

router.get("/resetPassword", loginController.resetPassword)

router.put("/newPassword", loginController.newPassword)

router.put("/updateProfilePicture", authentication.authLogin, loginController.updateProfilePicture)


export default router