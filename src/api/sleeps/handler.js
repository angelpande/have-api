const ErrorChecker = require("../../utils/ErrorChecker");

class SleepsHandler {
  constructor(sleepsService, validator) {
    this._sleepsService = sleepsService;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postSleepHandler = this.postSleepHandler.bind(this);
    this.getSleepHandler = this.getSleepHandler.bind(this);
    this.getSleepDurationHandler = this.getSleepDurationHandler.bind(this);
  }

  async postSleepHandler(request, h) {
    try {
      this._validator.validateSleepsPayload(request.payload);
      const { bedtime, wakeuptime } = request.payload;
      const sleepId = await this._sleepsService.addSleep({ bedtime, wakeuptime });
      console.log("Sleep added with ID:", sleepId);

      const response = h.response({
        status: "Success",
        message: "Sleep data added successfully",
        data: { sleepId },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getSleepHandler(request, h) {
    try {
      const sleeps = await this._sleepsService.getAllSleeps();
  
      const sleepsWithQuality = sleeps.map((sleep) => {
        try {
          const { quality } = this._sleepsService.calculateDuration(sleep.bedtime, sleep.wakeuptime);
          return {
            ...sleep,
            quality,
          };
        } catch (error) {
          console.error(`Error calculating duration for sleep ID ${sleep.id}:`, error.message);
          return {
            ...sleep,
            quality: 'Invalid data',
          };
        }
      });
  
      const response = h.response({
        status: 'success',
        message: 'All sleep data retrieved successfully',
        data: sleepsWithQuality,
      });
  
      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
  

  async getSleepDurationHandler(request, h) {
    try {
      const sleep = await this._sleepsService.getLatestSleep();

      const { hours, minutes, quality } = this._sleepsService.calculateDuration(sleep.bedtime, sleep.wakeuptime);

      const response = h.response({
        status: "success",
        message: "Sleep duration calculated successfully",
        data: {
          sleepId: sleep.id,
          hours,
          minutes,
          quality,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = SleepsHandler;
