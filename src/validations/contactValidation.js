import joi from "@hapi/joi" 


const contactValidationSchema = joi.object({
    firstName: joi.string().required().label("name").min(2).regex(/^[A-Z a-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters",
        "string.empty": "The name field can not be empty",
        'string.min': 'The name length must be at least 2 characters long',
    }),

    lastName: joi.string().required().label("name").min(2).regex(/^[A-Z a-z]+$/).messages({
        "string.pattern.base": "The name field can not include numbers and special characters",
        "string.empty": "The name field can not be empty",
        'string.min': 'The name length must be at least 2 characters long',
    }),

    email: joi.string().label("email").required().email().messages({
        'string.email': 'Invalid email',
        "string.empty": "The email field can not be empty",
    }),

    phoneNumber: joi.string().label("phone number").regex(/^([+]\d{2})?\d{10}$/).required().messages({
        "string.pattern.base": "Invalid phone number",
        "string.empty": "The phone number field can not be empty"
    }),
    
    message: joi.string().label("message").required().messages({
        "string.empty": "The message field can not be empty"
    }),

    replyMessage: joi.string(),

    subscriberEmail: joi.string().label("email").email().messages({
        'string.email': 'Invalid email'
    })
})





export default contactValidationSchema;