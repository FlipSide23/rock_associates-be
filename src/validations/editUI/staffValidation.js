import Joi from "@hapi/joi";

const staffValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "The name field can not be empty"
    }),
    position: Joi.string().required().messages({
        "string.empty": "The position field can not be empty"
    }),
    image: Joi.string()

})


export default staffValidationSchema