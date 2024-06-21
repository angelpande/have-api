const ErrorChecker = require("../../utils/ErrorChecker");

class RecommendationHandler {
  constructor(service) {
    this._service = service;
    this._errorCheck = ErrorChecker;

    this.getFoodRecommendationHandler = this.getFoodRecommendationHandler.bind(this);
    this.getExerciseRecommendationHandler = this.getExerciseRecommendationHandler.bind(this);
  }

  async getFoodRecommendationHandler(request, h) {
    try {
      const foodRecommendations = await this._service.getFoodRecommendation();

      const response = h.response({
        status: "success",
        message: "Food recommendations retrieved successfully",
        data: {
          foodRecommendations: foodRecommendations.map((recommendation) => ({
            id: recommendation.id,
            name: recommendation.name,
            calories: recommendation.calories,
            image_url: recommendation.img_url,
          })),
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getExerciseRecommendationHandler(request, h) {
    try {
      const exerciseRecommendations = await this._service.getExerciseRecommendation();

      const response = h.response({
        status: "success",
        message: "Exercise recommendations retrieved successfully",
        data: {
          exerciseRecommendations: exerciseRecommendations.map((recommendation) => ({
            id: recommendation.id,
            name: recommendation.name,
            calories: recommendation.calories,
            image_url: recommendation.img_url,
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

module.exports = RecommendationHandler;
