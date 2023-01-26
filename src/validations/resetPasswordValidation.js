import Joi from "@hapi/joi";

const resetPasswordValidationSchema = Joi.object({

    password: Joi.string().required().regex(/^(?=(.*[A-Z]){1,})(?=(.*[a-z]){1,})(?=(.*[0-9]){1,}).{5,}$/).messages({
        "string.pattern.base": "The password should have at least one capital letter and a number",
        "string.empty": "The password field can not be empty"
    }),

    repeatPassword: Joi.string().required().equal(Joi.ref("password")).messages({
        "any.only": "Passwords don't match"
    })
})


export default resetPasswordValidationSchema