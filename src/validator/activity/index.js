const InvariantError = require("../../exceptions/InvariantError");
const { ActivityPayloadSchema } = require("./schema");

const activityValidator = {
  validateActivityPayload: (payload) => {
    const validationResult = ActivityPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = activityValidator;