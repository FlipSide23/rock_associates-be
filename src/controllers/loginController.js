import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import forgotPasswordValidationSchema from "../validations/forgotPasswordValidation.js"
import resetPasswordValidationSchema from "../validations/resetPasswordValidation.js"
import cloudinary from "../helpers/cloudinary.js";
import subscription from "../models/subscriptionModel.js";


const loginUser = async(request, response) =>{
    try{
        const getUser = await User.findOne({email: request.body.email})

        if (!getUser) 
            return response.status(400).json({
                "invalidEmail": "Invalid email or password, Please try again!"
            })

        if(!getUser.isVerified)
            return response.status(400).json({
                "invalidEmail": "Please check your email to verify this account!"
            })

        
        const userPassword = await bcrypt.compare(request.body.password, getUser.password)

        if (!userPassword)
            return response.status(400).json({
                "invalidPassword": "Invalid email or password, Please try again!"
            })
        
        const token = Jwt.sign({ data : getUser } , process.env.ACCESS_TOKEN_SECRET)

        response.status(200).json({
            "successMessage": "Logged In Successfully!",
            "User": getUser, 
            "Access_Token": token,
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

        const loggedInUser = await User.findOne({ _id : request.user._id })

        response.status(200).json({
            "successMessage": "LoggedIn User Fetched Successfully!",
            "loggedInUser": loggedInUser, 
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

                let current_user= request.user;

                await User.updateOne({
                    _id : current_user._id
                },{
                    imageLink : result.secure_url,
                    ImagePresent: request.body.ImagePresent
                    })

                response.status(200).json({
                    "successMessage": "Profile picture updated successfully!",
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

const deleteImage = (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(file, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
  
const deleteProfilePicture = async (request, response) => {
    try {
      let current_user = request.user;
      const file = request.body.imageLink;
      
      await deleteImage(file);
  
      await User.updateOne({
        _id: current_user._id
      }, {
        imageLink: null,
        ImagePresent: false
      });
  
      response.status(200).json({
        "successMessage": "Profile picture deleted successfully!"
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        "status": "fail",
        "errorMessage": error.message
      });
    }
  };


  
  const emailRegisteredUsers = async (request, response) => {
    try {

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

        const allUsers = await User.find();

        allUsers.forEach(user => {
           let firstName = user.firstName;
           let email =  user.email;

        const mailOptions = {
            from: '"Rock Associates Co. Ltd" <flipsidedev0@gmail.com>',
            to: email,
            subject: "Rock Associates Company Ltd",
            html: `
            <!doctype html>
            <html lang="en" 
                xmlns="http://www.w3.org/1999/xhtml" 
                xmlns:v="urn:schemas-microsoft-com:vml" 
                xmlns:o="urn:schemas-microsoft-com:office:office">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="x-apple-disable-message-reformatting">
                
                <title>Rock Associates Company Ltd</title>
                
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                
            </head>
            <body style="margin:0; padding:0; background:#eeeeee;">
                
            
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                </div>
                
                <center>
                
                <div style="width:80%; background:#ffffff; padding:30px 20px; text-align:left; font-family: 'Arial', sans-serif;">
                
                <!--[if mso]>
                <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" bgcolor="#ffffff">
                <tr>
                <td align="left" valign="top" style="font-family: 'Arial', sans-serif; padding:20px;">
                <![endif]--> 
                    
                    <a href='https://rockassociates.netlify.app/'><img src='https://www.linkpicture.com/q/logoResized.jpg' type='image'></a>
                
                <h1 style="font-size:16px; line-height:22px; font-weight:normal; color:#333333;">
                    Hello ${firstName},
                </h1>
                
                <p style="font-size:14px; line-height:24px; color:#666666; margin-bottom:30px;">
                    ${request.body.emailBody}
                </p>
                
                
                
                <hr style="border:none; height:1px; color:#dddddd; background:#dddddd; width:100%; margin-bottom:20px;">
                
                <p style="font-size:12px; line-height:18px; color:#999999; margin-bottom:10px; text-align: center;">
                    &copy; Copyright 2023 
                    <a href="https://rockassociates.netlify.app/" 
                    style="font-size:12px; line-height:18px; color:#3aaf47; text-decoration: none; font-weight:bold;">
                    Rock Associates Company Ltd</a>, All Rights Reserved.
                </p>
                
                <!--[if mso | IE]>
                </td>
                </tr>
                </table>
                <![endif]-->
                
                </div>
                
                </center>
                
            </body>
            </html>                                             
            `
        }

    
    

        sender.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }

            else{
                console.log("Email Sent successfully")
            }
        })

    }); 

        response.status(200).json({
            "successMessage": "Email sent successfully to all users!",
        })

   
      
    } catch (error) {
      console.log(error);
      response.status(500).json({
        "status": "fail",
        "errorMessage": error.message
      });
    }
  };
  
  

export default { loginUser, loggedInUser, forgotPassword, resetPassword, newPassword, updateProfilePicture,
     deleteProfilePicture, emailRegisteredUsers }