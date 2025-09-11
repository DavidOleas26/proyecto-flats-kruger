import Joi from 'joi'

const getMaxBuiltYear = () => {
  const prsentYear = new Date().getFullYear()
  const maxYearsOld = 100
  return new Date(prsentYear - maxYearsOld, 0, 1)
}

const validateFlatSchema = Joi.object(
  {
    city: Joi.string()
      .required()
      .max(50)
      .messages({
        'string.base': 'La ciudad debe ser un texto.',
        'string.max': 'La ciudad no puede tener más de 50 caracteres.',
        'any.required': 'La ciudad es obligatoria.'
      }),

    streetName: Joi.string()
      .required()
      .max(50)
      .messages({
        'string.base': 'El nombre de la calle debe ser un texto.',
        'string.max': 'El nombre de la calle no puede tener más de 50 caracteres.',
        'any.required': 'El nombre de la calle es obligatorio.'
      }),

    streetNumber: Joi.number()
      .required()
      .integer()
      .positive()
      .messages({
        'number.base': 'El número de la calle debe ser numérico.',
        'number.integer': 'El número de la calle debe ser un entero.',
        'number.positive': 'El número de la calle debe ser positivo.',
        'any.required': 'El número de la calle es obligatorio.'
      }),

    areaSize: Joi.number()
      .required()
      .positive()
      .messages({
        'number.base': 'El tamaño del área debe ser numérico.',
        'number.positive': 'El tamaño del área debe ser un número positivo.',
        'any.required': 'El tamaño del área es obligatorio.'
      }),

    hasAc: Joi.boolean()
      .required()
      .messages({
        'boolean.base': 'El campo de aire acondicionado debe ser verdadero o falso.',
        'any.required': 'Debes indicar si tiene aire acondicionado.'
      }),

    yearBuilt: Joi.date()
      .required()
      .greater(getMaxBuiltYear())
      .max('now')
      .messages({
        'date.base': 'El año de construcción debe ser una fecha válida.',
        'date.greater': 'El año de construcción no puede ser anterior a hace 100 años.',
        'date.max': 'El año de construcción no puede ser en el futuro.',
        'any.required': 'El año de construcción es obligatorio.'
      }),

    rentPrice: Joi.number()
      .required()
      .precision(2)
      .positive()
      .messages({
        'number.base': 'El precio de alquiler debe ser numérico.',
        'number.precision': 'El precio de alquiler solo puede tener hasta 2 decimales.',
        'number.positive': 'El precio de alquiler debe ser un número positivo.',
        'any.required': 'El precio de alquiler es obligatorio.'
      }),

    description: Joi.string()
      .max(1000)
      .trim()
      .messages({
        'string.base': 'La descripción debe ser un texto.',
        'string.max': 'La descripción no puede superar los 1000 caracteres.'
    }),  

    dateAvailable: Joi.date()
      .required()
      .min('now')
      .messages({
        'date.base': 'La fecha de disponibilidad debe ser una fecha válida.',
        'date.min': 'La fecha de disponibilidad no puede ser en el pasado.',
        'any.required': 'La fecha de disponibilidad es obligatoria.'
      }),
  }
)

const validateUpdateFlatSchema = Joi.object({
  city: Joi.string()
    .max(50)
    .messages({
      "string.base": "La ciudad debe ser un texto.",
      "string.max": "La ciudad no debe superar los 50 caracteres."
    }),
    
  streetName: Joi.string()
    .max(50)
    .messages({
      "string.base": "El nombre de la calle debe ser un texto.",
      "string.max": "El nombre de la calle no debe superar los 50 caracteres."
    }),

  streetNumber: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El número de calle debe ser un número.",
      "number.integer": "El número de calle debe ser un número entero.",
      "number.positive": "El número de calle debe ser mayor que cero."
    }),

  areaSize: Joi.number()
    .positive()
    .messages({
      "number.base": "El tamaño del área debe ser un número.",
      "number.positive": "El tamaño del área debe ser mayor que cero."
    }),

  hasAc: Joi.boolean()
    .messages({
      "boolean.base": "El valor de aire acondicionado debe ser verdadero o falso."
    }),

  yearBuilt: Joi.date()
    .greater(getMaxBuiltYear())
    .max('now')
    .messages({
      "date.base": "El año de construcción debe ser una fecha válida.",
      "date.greater": `El año de construcción debe ser posterior a ${getMaxBuiltYear().getFullYear()}.`,
      "date.max": "El año de construcción no puede ser en el futuro."
    }),

  rentPrice: Joi.number()
    .precision(2)
    .positive()
    .messages({
      "number.base": "El precio de renta debe ser un número.",
      "number.precision": "El precio de renta puede tener hasta 2 decimales.",
      "number.positive": "El precio de renta debe ser mayor que cero."
    }),

  description: Joi.string()
    .max(1000)
    .trim()
    .messages({
      'string.base': 'La descripción debe ser un texto.',
      'string.max': 'La descripción no puede superar los 1000 caracteres.'
  }), 

  dateAvailable: Joi.date()
    .min('now')
    .messages({
      "date.base": "La fecha de disponibilidad debe ser una fecha válida.",
      "date.min": "La fecha de disponibilidad no puede ser anterior a hoy."
    })
})

const validateFlatQuerySchema = Joi.object({
  city: Joi.string()
    .max(50)
    .messages({
      "string.base": "La ciudad debe ser una cadena",
      "string.max": "La ciudad no puede tener más de 50 caracteres"
    }),

  minPrice: Joi.number()
    .positive()
    .messages({
      "number.base": "El precio mínimo debe ser un número",
      "number.positive": "El precio mínimo debe ser mayor a 0"
    }),

  maxPrice: Joi.number()
    .positive()
    .messages({
      "number.base": "El precio máximo debe ser un número",
      "number.positive": "El precio máximo debe ser mayor a 0"
    }),

  minArea: Joi.number()
    .positive()
    .messages({
      "number.base": "El área mínima debe ser un número",
      "number.positive": "El área mínima debe ser mayor a 0"
    }),

  maxArea: Joi.number()
    .positive()
    .messages({
      "number.base": "El área máxima debe ser un número",
      "number.positive": "El área máxima debe ser mayor a 0"
    }),

  sortBy: Joi.string()
    .valid("createdAt", "city", "rentPrice", "areaSize")
    .messages({
      "any.only": "El campo de ordenamiento debe ser uno de: createdAt, city, rentPrice, areaSize",
      "string.base": "El campo de ordenamiento debe ser una cadena"
    }),

  order: Joi.string()
    .valid("asc", "desc")
    .default("asc")
    .messages({
      "any.only": "El orden debe ser 'asc' o 'desc'",
      "string.base": "El orden debe ser una cadena"
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "La página debe ser un número",
      "number.min": "La página mínima es 1",
      "number.integer": "La página debe ser un número entero"
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      "number.base": "El límite debe ser un número",
      "number.min": "El límite mínimo es 1",
      "number.max": "El límite máximo es 100",
      "number.integer": "El límite debe ser un número entero"
    })
})

export { validateFlatSchema, validateUpdateFlatSchema, validateFlatQuerySchema }