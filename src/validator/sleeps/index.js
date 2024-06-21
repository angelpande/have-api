const InvariantError = require("../../exceptions/InvariantError");
const { SleepPayloadSchema } = require("./schema");

const sleepsValidator = {
  validateSleepsPayload: (payload) => {
    const validationResult = SleepPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = sleepsValidator;
