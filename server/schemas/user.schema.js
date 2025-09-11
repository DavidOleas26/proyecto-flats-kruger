import joi from "joi";

const getMinBirthDate = () => {
  const presentDay = new Date()
  return new Date(presentDay.getFullYear() - 18, presentDay.getMonth(), presentDay.getDay());
}

const validateUserSchema = joi.object({
  firstName: joi.string()
    .min(2)
    .required()
    .messages({
      'string.base': 'El nombre debe ser un texto.',
      'string.empty': 'El nombre es obligatorio.',
      'string.min': 'El nombre debe tener al menos 2 caracteres.',
      'any.required': 'El nombre es obligatorio.'
    }),
  
  lastName: joi.string()
    .min(2)
    .required()
    .messages({
      'string.base': 'El apellido debe ser un texto.',
      'string.empty': 'El apellido es obligatorio.',
      'string.min': 'El apellido debe tener al menos 2 caracteres.',
      'any.required': 'El apellido es obligatorio.'
    }),

  email: joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'El correo electrónico debe ser un texto.',
      'string.empty': 'El correo electrónico es obligatorio.',
      'string.email': 'Debe ingresar un correo electrónico válido.',
      'any.required': 'El correo electrónico es obligatorio.'
    }),

  password: joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{6,}$/)
    .required()
    .messages({
      'string.base': 'La contraseña debe ser un texto.',
      'string.empty': 'La contraseña es obligatoria.',
      'string.min': 'La contraseña debe tener al menos 6 caracteres.',
      'string.pattern.base': 'La contraseña debe incluir al menos una letra, un número y un carácter especial.',
      'any.required': 'La contraseña es obligatoria.'
    }),

  birthdate: joi.date()
    .max(getMinBirthDate())
    .required()
    .messages({
      'date.base': 'La fecha de nacimiento no es válida.',
      'date.max': 'Debes tener al menos 18 años.',
      'any.required': 'La fecha de nacimiento es obligatoria.'
    })
});

const validateUpdateUserSchema = joi.object({
  firstName: joi.string()
    .min(2)
    .messages({
      'string.base': 'El nombre debe ser un texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 2 caracteres.'
    }),

  lastName: joi.string()
    .min(2)
    .messages({
      'string.base': 'El apellido debe ser un texto.',
      'string.empty': 'El apellido no puede estar vacío.',
      'string.min': 'El apellido debe tener al menos 2 caracteres.'
    }),

  email: joi.string()
    .email()
    .messages({
      'string.base': 'El correo electrónico debe ser un texto.',
      'string.empty': 'El correo electrónico no puede estar vacío.',
      'string.email': 'Debe ingresar un correo electrónico válido.'
    }),

  password: joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{6,}$/)
    .messages({
      'string.base': 'La contraseña debe ser un texto.',
      'string.empty': 'La contraseña no puede estar vacía.',
      'string.min': 'La contraseña debe tener al menos 6 caracteres.',
      'string.pattern.base': 'La contraseña debe incluir al menos una letra, un número y un carácter especial.'
    }),

  birthdate: joi.date()
    .max(getMinBirthDate())
    .messages({
      'date.base': 'La fecha de nacimiento no es válida.',
      'date.max': 'Debes tener al menos 18 años.'
    }),

  role: joi.string()
    .valid("user", "admin")
    .default("user")
    .messages({
      "string.base": "Role must be a string",
      "any.only": "Role must be either 'user' or 'admin'",
    }),
});

const validateUserQuerySchema = joi.object({
  role: joi.string()
    .valid("admin", "user")
    .messages({
      "any.only": "El rol debe ser 'admin' o 'user'",
      "string.base": "El rol debe ser una cadena de texto"
    }),

  minAge: joi.number()
    .integer()
    .min(18)
    .messages({
      "number.base": "La edad mínima debe ser un número",
      "number.min": "La edad mínima no puede ser menor que 18",
      "number.integer": "La edad mínima debe ser un número entero"
    }),

  maxAge: joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "La edad máxima debe ser un número",
      "number.min": "La edad máxima no puede ser menor que 0",
      "number.integer": "La edad máxima debe ser un número entero"
    }),

  minFlats: joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "El número mínimo de departamentos debe ser un número",
      "number.min": "El número mínimo de departamentos no puede ser menor que 0",
      "number.integer": "El número mínimo de departamentos debe ser un número entero"
    }),

  maxFlats: joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "El número máximo de departamentos debe ser un número",
      "number.min": "El número máximo de departamentos no puede ser menor que 0",
      "number.integer": "El número máximo de departamentos debe ser un número entero"
    }),

  sortBy: joi.string()
    .valid("createdAt", "firstName", "lastName", "flatsCounter")
    .messages({
      "any.only": "El campo de ordenamiento no es válido",
      "string.base": "El campo de ordenamiento debe ser una cadena"
    }),

  order: joi.string()
    .valid("asc", "desc")
    .default("asc")
    .messages({
      "any.only": "El orden debe ser 'asc' o 'desc'",
      "string.base": "El orden debe ser una cadena"
    }),

  page: joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "La página debe ser un número",
      "number.min": "La página mínima es 1",
      "number.integer": "La página debe ser un número entero"
    }),

  limit: joi.number()
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

export { validateUserSchema, validateUpdateUserSchema, validateUserQuerySchema };
