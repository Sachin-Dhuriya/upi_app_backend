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

const bankAccountLinkValidator = Joi.object({
    account_number: Joi.string().min(8).required().messages({
        "number.empty": "Account number is required",
        "number.min" : "Account Number must be of 8 characters"
    }),
    ifsc_code: Joi.string().min(6).required().messages({
        "string.empty": "IFSC code is requires",
        "string.min": "IFSC code should have atleast 6 characters"
    }),
    balance: Joi.number().positive().messages({
        "number.positive": "Account balance could not be negative"
    })

})

export default {userValidator, bankAccountLinkValidator}