import Joi from "@hapi/joi";

const blogValidationSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "The title can not be empty"
    }),
    postBody: Joi.string().required().messages({
        "string.empty": "The post body can not be empty"
    }),
    // postImage: Joi.string(),

    // commentBody: Joi.string(),
    // commentorName: Joi.string(),
    // commentorImage: Joi.string(),
    // dateCommented: Joi.string(),

    // replyBody: Joi.string(),
    // replierName: Joi.string(),
    // replierImage: Joi.string(),
    // dateReplied: Joi.string()

})


export default blogValidationSchema