import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import forgotPasswordValidationSchema from "../validations/forgotPasswordValidation.js"
import resetPasswordValidationSchema from "../validations/resetPasswordValidation.js"
import cloudinary from "../helpers/cloudinary.js";


const loginUser = async(request, response) =>{
    try{
        const getUser = await User.findOne({email: request.body.email})

        if (!getUser) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again"
            })

        if(!getUser.isVerified)
            return response.status(400).json({
                "invalidEmail": "Please check your email to verify this account!"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, getUser.password)

        if (!userPassword)
            return response.status(400).json({
                "invalidPassword": "Invalid email or password, Please try again"
            })
        
        const token = Jwt.sign({ data : getUser } , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'})

        response.status(200).json({
            "successMessage": "Logged In Successfully!",
            "User": getUser, 
            "Access_Token": token
        })
    }

    catch(error){
        console.log(error.message)
        response.status(500).json({
            "status": "Fail",
            "errorMessage": error.message
        })
    }
}


const loggedInUser = async(request, response) =>{
    try{
        response.status(200).json({
            "successMessage": "LoggedIn User Fetched Successfully!",
            "loggedInUser": request.user, 
        })
    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}

// forgot password

const forgotPassword = async(request, response) =>{
    try{
        const {error} = forgotPasswordValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const getUser = await User.findOne({email: request.body.email})

        if (!getUser) 
            return response.status(400).json({
                "invalidEmail": `${request.body.email} is not registered`
            })

        if(!getUser.isVerified)
            return response.status(400).json({
                "unverifiedEmail": "This email is not verified!"
            })
      

        const resetPasswordToken = Jwt.sign({getUser}, process.env.FORGOTPASSWORD_RESET_SECRET)
        response.header("auth_token", resetPasswordToken)

        await getUser.updateOne({
            resetToken: resetPasswordToken
        })

        const sender = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: "flipsidedev0@gmail.com",
                pass: process.env.NODEMAILER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailOptions = {
            from: '"Rock Associates Co. Ltd" <flipsidedev0@gmail.com>',
            to: getUser.email,
            subject: "Rock Associates Co. Ltd | Reset your password",
            html: `
            <div style="padding: 10px 0;">
                <h3> ${getUser.firstName} ${getUser.lastName} we can see you forgot your password! </h3> 
                <h4> Click the button below to reset your password... </h4>
                <a style="border-radius: 5px; margin-bottom: 10px; text-decoration: none; color: white; padding: 10px; cursor: pointer; background: #28a745;" 
                href="http://${request.headers.host}/resetPassword?resetToken=${resetPasswordToken}"> 
                Reset password </a>
            </div>
            `
        }


        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Please check your account to reset your password")

                response.status(200).json({
                    "resetSuccess": "Please check your email to reset your password",
                    "resetPasswordToken": resetPasswordToken
                })
            }
        })           
    }   

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// Resetting the password

const resetPassword = async(request, response) =>{
    try{
      const token = request.query.resetToken

      const getToken = await User.findOne({resetToken: token})

      if (getToken){

        getToken.resetToken = null
        await getToken.save()

        response.redirect(process.env.RESETPASSWORD_REDIRECT_URL)
      }

      else{
        response.send("You can't use this reset password link twice! If you wish to reset your password again, consider repeating the request!")
      }

    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}



// Creating a new password

const newPassword = async(request, response) =>{ 
    try{

        const {error} = resetPasswordValidationSchema.validate(request.body)

        if (error)
            return response.status(400).json({"validationError": error.details[0].message})


        const token = request.header("auth_token")

        if(!token)
        return response.status(401).json({
            "tokenError": "Something is wrong! Please consider repeating the request to be able to reset your password!"
        })

        Jwt.verify(token, process.env.FORGOTPASSWORD_RESET_SECRET, async (err, decodedToken)=>{
            if(err){
                console.log(err.message)
            }

            else{
                const userNewPassword = await User.findById(decodedToken.getUser._id)

                const newSalt = await bcrypt.genSalt()
                const newHashedPassword = await bcrypt.hash(request.body.password, newSalt)
                const newHashedRepeatPassword = await bcrypt.hash(request.body.repeatPassword, newSalt)

                await userNewPassword.updateOne({
                    password: newHashedPassword,
                    repeatPassword: newHashedRepeatPassword
                })

                response.status(200).json({"newPasswordSuccess": "Password is reseted successfully!"})
            }
         })
    }


    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}


// update user profile

const updateProfilePicture = async(request, response) =>{


    try{
        
        const result = await cloudinary.uploader.upload(request.body.imageLink, {
            folder: "Rock Associates Images"
        })

                const ourLoggedInUser = await User.findById(request.user._id) 

                if (ourLoggedInUser){
                        ourLoggedInUser.imageLink = result.secure_url || ourLoggedInUser.imageLink
                    
                    
                    const updatedUser = await ourLoggedInUser.save()

                    const newProfilePicture = {
                        imageLink: updatedUser.imageLink
                    }

                    response.status(200).json({
                        "message": "Profile picture updated successfully!",
                        "ourUpdatedUser": newProfilePicture
                    })
                }

                else{
                    response.status(404).json({"message": "User not found!"})
                }

    }

    catch(error){
        console.log(error)
        response.status(500).json({
            "status": "fail",
            "errorMessage": error.message
        })
    }
}

export default { loginUser, loggedInUser, forgotPassword, resetPassword, newPassword, updateProfilePicture }