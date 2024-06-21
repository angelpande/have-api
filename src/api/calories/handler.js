const fs = require('fs');
const path = require('path');
const ErrorChecker = require('../../utils/ErrorChecker');

class CaloriesHandler {
  constructor(caloriesService, validator) {
    this._caloriesService = caloriesService;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postCalorieHandler = this.postCalorieHandler.bind(this);
    this.getCaloriesHandler = this.getCaloriesHandler.bind(this);
    this.getCalorieImageHandler = this.getCalorieImageHandler.bind(this);
    this.deleteCalorieHandler = this.deleteCalorieHandler.bind(this);
    this.updateCalorieHandler = this.updateCalorieHandler.bind(this);
    this.getTopCaloriesHandler = this.getTopCaloriesHandler.bind(this);
    this.getCaloriesOverviewHandler = this.getCaloriesOverviewHandler.bind(this);
  }

  async postCalorieHandler(request, h) {
    try {
      this._validator.validateCaloriePayload(request.payload);
      const { foodname, calories, image } = request.payload;

      let imageData = null;
      if (image) {
        imageData = image._data; // This will be the binary data of the image
      }

      const calorieId = await this._caloriesService.addCalorie({
        image: imageData,
        foodname,
        calories,
      });

      const response = h.response({
        status: 'success',
        message: 'Added successfully',
        data: {
          calorieId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getCaloriesHandler(request, h) {
    try {
      const calories = await this._caloriesService.getCalories();

      const response = h.response({
        status: 'success',
        message: 'Calories retrieved successfully',
        data: {
          calories: calories.map((calorie) => ({
            calorieId: calorie.id,
            image: calorie.image ? calorie.image.toString('base64') : null,  // Return the image data as needed
            foodname: calorie.foodname,
            calories: calorie.calories,
            created: calorie.created_at,
          })),
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async deleteCalorieHandler(request, h) {
    try {
      const { id } = request.params;
      await this._caloriesService.deleteCalorieById(id);

      const response = h.response({
        status: 'success',
        message: 'Calorie deleted successfully',
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async updateCalorieHandler(request, h) {
    try {
      this._validator.validateCaloriePayload(request.payload);
      const { id } = request.params;
      const { foodname, calories } = request.payload;
      await this._caloriesService.updateCalorieById(id, { foodname, calories });

      const response = h.response({
        status: 'success',
        message: 'Calorie updated successfully',
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getCalorieImageHandler(request, h) {
    try {
      const { id } = request.params;
      const calorie = await this._caloriesService.getCalorieById(id);

      if (!calorie || !calorie.image) {
        throw new NotFoundError('Image not found');
      }

      const response = h.response(calorie.image);
      response.type('image/jpeg'); // Assuming the images are JPEG. Adjust MIME type as necessary.
      response.code(200);

      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getTopCaloriesHandler(request, h) {
    try {
      console.log("Fetching top 3 high calorie foods");
      const topCalories = await this._caloriesService.getTopCalories();

      const response = h.response({
        status: 'success',
        message: 'Top 3 high calorie foods retrieved successfully',
        data: topCalories.map(calorie => ({
          calorieId: calorie.id,
          foodname: calorie.foodname,
          calories: calorie.calories,
          date: calorie.date,
          image: calorie.image ? calorie.image.toString('base64') : null, // Check for null image
        })),
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async getCaloriesOverviewHandler(request, h) {
    try {
      const calories = await this._caloriesService.getCalorieOverview();

      const response = h.response({
        status: 'success',
        message: 'Calories retrieved successfully',
        data: {
          calorieId: calories.id,
          image: calories.image ? calories.image.toString('base64') : null,
          foodname: calories.foodname,
          calories: calories.calories,
          created: calories.created_at,
        },
      });

      response.code(200);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = CaloriesHandler;
