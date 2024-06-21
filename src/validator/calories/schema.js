const Joi = require('joi');

const CaloriePayloadSchema = Joi.object({
  foodname: Joi.string().required(),
  calories: Joi.number().required(),
  image: Joi.any().optional() // Mengizinkan image sebagai buffer atau string
});

module.exports = { CaloriePayloadSchema };
