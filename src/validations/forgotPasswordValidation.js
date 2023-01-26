import Joi from "@hapi/joi";

const forgotPasswordValidationSchema = Joi.object({

    email: Joi.string().required().email().messages({
        "string.email": "Invalid email",
        "string.empty": "The email field can not be empty"
    }),

})


export default forgotPasswordValidationSchema