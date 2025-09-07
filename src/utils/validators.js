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

const sendMoneyValidator = Joi.object({
    fromAccountId: Joi.number().integer().required(),
    to_upi_id: Joi.string().required().messages({
        "string.empty": "Reciever UPI id required"
    }),
    amount: Joi.number().positive().precision(2).required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than zero",
    "any.required": "Amount is required"
  })
})

const requestMoneyValidator = Joi.object({
    to_user_id: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required()
})

export const respondRequestValidator = Joi.object({
  request_id: Joi.number().integer().positive().required(),
  action: Joi.string().valid("Accepted", "Rejected").required()
});

export default {userValidator, bankAccountLinkValidator, sendMoneyValidator, requestMoneyValidator, respondRequestValidator}