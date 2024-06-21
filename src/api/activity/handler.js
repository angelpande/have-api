// ActivityHandler.js
const ErrorChecker = require("../../utils/ErrorChecker");
class ActivityHandler {
  constructor(activityService, validator) {
    this._activityService = activityService;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postActivityHandler = this.postActivityHandler.bind(this);
    this.getActivityHandler = this.getActivityHandler.bind(this);
    this.getAllActivityHandler = this.getAllActivityHandler.bind(this);
  }

  async postActivityHandler(request, h) {
    try {
      this._validator.validateActivityPayload(request.payload);
      const { name, duration } = request.payload;
      const activityId = await this._activityService.addActivity({ name, duration });
      console.log("Activity added with ID:", activityId);

      const response = h.response({
        status: "Success",
        message: "Activity data added successfully",
        data: { activityId },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  // Updated getActivityHandler method
  async getActivityHandler(request, h) {
    try {
      console.log("Fetching the latest activity data");
      const activity = await this._activityService.getLatestActivity();

      const response = h.response({
        status: "success",
        message: "Activity data retrieved successfully",
        data: {
          activityId: activity.id,
          name: activity.name,
          duration: activity.duration,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getAllActivityHandler(request, h) {
    try {
      const allactivity = await this._activityService.getAllActivity();

      // Ensure allactivity is an array
      if (!Array.isArray(allactivity)) {
        throw new Error('Expected an array but got a different type');
      }

      const response = h.response({
        status: "success",
        message: "Activity data retrieved successfully",
        data: {
          allactivity: allactivity.map((activity) => ({
            activityId: activity.id,
            name: activity.name,
            duration: activity.duration,
          })),
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = ActivityHandler;
