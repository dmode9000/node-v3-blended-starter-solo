import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { CATEGORIES } from '../constants/categories.js';

// custom validator for ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// base body schemas to reuse
const bodySchemaBase = Joi.object({
  name: Joi.string().min(1).messages({
    'string.min': 'Name must be at least 1 characters long',
    'string.base': 'Name must be a string',
    'any.required': 'Name is a required field',
  }),
  price: Joi.number().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is a required field',
  }),
  description: Joi.string().allow(''),
  category: Joi.string()
    .valid(...CATEGORIES)
    .messages({
      'string.base': 'Category must be a string',
      'any.required': 'Category is a required field',
      'any.only': `Category must be one of the following values: ${CATEGORIES.join(
        ', ',
      )}`,
    }),
});

// base productId schema to reuse
const productIdSchemaBase = Joi.object({
  productId: Joi.string().custom(objectIdValidator).required().messages({
    'string.required': 'productId is a required field',
  }),
});

// for GET /notes route, to validate query string parameters:
export const getAllProductsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.min': 'Page must be at least 1',
      'number.integer': 'Page must be an integer',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.min': 'PerPage must be at least 5',
      'number.max': 'PerPage must be at most 20',
      'number.integer': 'PerPage must be an integer',
    }),
    category: Joi.string()
      .valid(...CATEGORIES)
      .messages({
        'any.only': `Category must be one of the following values: ${CATEGORIES.join(
          ', ',
        )}`,
      }),
    search: Joi.string().allow('').trim().messages({
      'string.base': 'Search must be a string',
    }),
  }),
};

// For GET /notes/:productId route, to validate the productId parameter:
export const productIdSchema = {
  [Segments.PARAMS]: productIdSchemaBase,
};

// For POST /notes route, to validate the request body:
export const createProductSchema = {
  [Segments.BODY]: bodySchemaBase.fork(
    ['name', 'price', 'category'],
    (schema) => schema.required(),
  ),
};

// For PATCH /notes/:productId route, to validate productId & request body:
export const updateProductSchema = {
  [Segments.PARAMS]: productIdSchemaBase,
  [Segments.BODY]: bodySchemaBase.min(1),
};
