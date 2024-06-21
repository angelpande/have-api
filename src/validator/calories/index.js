const InvariantError = require("../../exceptions/InvariantError");
const { CaloriePayloadSchema } = require("./schema");

const caloriesValidator = {
  validateCaloriePayload: (payload) => {
    const validationResult = CaloriePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = caloriesValidator;