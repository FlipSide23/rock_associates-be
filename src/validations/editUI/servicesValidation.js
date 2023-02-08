import Joi from "@hapi/joi";

const servicesValidationSchema = Joi.object({
    
    serviceTitle: Joi.string().required().messages({
        "string.empty": "The title field can not be empty"
    }),
    serviceDescription: Joi.string().required().messages({
        "string.empty": "The description field can not be empty"
    })

})


export default servicesValidationSchema