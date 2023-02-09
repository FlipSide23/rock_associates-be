import Joi from "@hapi/joi";

const projectsValidationSchema = Joi.object({
    
    title: Joi.string().required().messages({
        "string.empty": "The title field can not be empty"
    }),

    projectImage: Joi.string(),

    description: Joi.string().required().messages({
        "string.empty": "The description field can not be empty"
    }),

    activitiesPerformed: Joi.string().required().messages({
        "string.empty": "Activities field can not be empty"
    }),

    result: Joi.string().required().messages({
        "string.empty": "The result field can not be empty"
    }),

    employer: Joi.string().required().messages({
        "string.empty": "Employer field can not be empty"
    }),

    year: Joi.string().required().messages({
        "string.empty": "The year field can not be empty"
    }),

    location: Joi.string().required().messages({
        "string.empty": "The location field can not be empty"
    }),

    client: Joi.string().required().messages({
        "string.empty": "The client field can not be empty"
    }),

    category: Joi.string().required().messages({
        "string.empty": "The category field can not be empty"
    })

})


export default projectsValidationSchema