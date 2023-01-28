import Joi from "@hapi/joi";

const commentValidationSchema = Joi.object({

    comment: Joi.string().required().messages({
        "string.empty": "The comment field can not be empty"
    }),

})


export default commentValidationSchema