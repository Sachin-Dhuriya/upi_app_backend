import Joi from "joi";

const userValidator = Joi.object({
    name: Joi.string().required().messages({
        "string.empty" : "name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format"
    }),
    password: Joi.string().min(6).max(16).required().messages({
        "string.empty": "Password Required",
        "string.min": "Password should be between 6-16 Characters",
        "string.max": "Password should be between 6-16 Characters"
    }),
})

export default {userValidator}