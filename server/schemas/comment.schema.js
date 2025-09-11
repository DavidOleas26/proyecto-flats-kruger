import Joi from 'joi'

const validateCommentSchema = Joi.object(
  {
    flatId: Joi.string().required().messages({
      "any.required": "flatId is required",
    }),
    rating: Joi.number().required().min(1).max(5).messages({
    'number.base': 'La calificación debe ser un número.',
    'number.min': 'La calificación mínima es 1.',
    'number.max': 'La calificación máxima es 5.',
    'any.required': 'La calificación es obligatoria.'
    }),
    senderId: Joi.string().required().messages({
      "any.required": "SenderId is required",
    }), 
    content: Joi.string().required().messages({
      "string.empty": "Content cannot be empty",
      "any.required": "Content is required",
    }), 
    parentId: Joi.string().allow(null).required().messages({
      "any.required": "parentId is required",
    })
  }
)

export { validateCommentSchema }
