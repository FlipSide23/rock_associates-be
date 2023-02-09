import Joi from "@hapi/joi";

const testimonialValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "The name field can not be empty"
    }),

    location: Joi.string().required().messages({
        "string.empty": "The location field can not be empty"
    }),

    testimonial: Joi.string().max(380).required().messages({
        "string.empty": "The testimonial field can not be empty",
        'string.max': 'The testimonial text must have no more than 380 words.'
    }),
    

    image: Joi.string()

})


export default testimonialValidationSchema