import joi from "@hapi/joi" 


const subscriptionValidationSchema = joi.object({

    subscriberEmail: joi.string().label("email").required().email().messages({
        'string.email': 'Invalid email',
        "string.empty": "The email field can not be empty"
    })
})

export default subscriptionValidationSchema;