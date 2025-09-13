import Joi from "joi";

export const sellerApplicationValidator = Joi.object({
  ownerName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Owner name is required",
      "string.min": "Owner name must be at least 2 characters",
      "string.max": "Owner name must not exceed 100 characters"
    }),

  contactEmail: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Contact email is required",
      "string.email": "Please provide a valid email address"
    }),

  contactPhone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Contact phone is required",
      "string.pattern.base": "Phone number must be between 10 and 15 digits"
    }),

  reasonForJoining: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.max": "Reason for joining must not exceed 500 characters"
    }),


  attachments: Joi.array()
    .items(Joi.string().uri().messages({
      "string.uri": "Attachments must be valid URLs"
    }))
    .optional(),

 
});
