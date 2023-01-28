import Joi from "@hapi/joi";

const commentReplyValidationSchema = Joi.object({

    reply: Joi.string().required().messages({
        "string.empty": "The reply field can not be empty"
    }),

})


export default commentReplyValidationSchema