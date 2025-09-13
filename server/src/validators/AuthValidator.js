import Joi from "joi";

export const userValidator = Joi.object({
 

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address"
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be between 10 and 15 digits"
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .optional()
    .messages({
      "string.alphanum": "Username must only contain letters and numbers",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters"
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 128 characters"
    })
});
