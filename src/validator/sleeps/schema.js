const Joi = require('joi');

const SleepPayloadSchema = Joi.object({
  bedtime: Joi.string().required(),
  wakeuptime: Joi.string().required(),
});

module.exports = { SleepPayloadSchema };
