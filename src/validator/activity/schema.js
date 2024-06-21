const Joi = require('joi');

const ActivityPayloadSchema = Joi.object({
  name: Joi.string().required(),
  duration: Joi.string().required(),
});

module.exports = { ActivityPayloadSchema };