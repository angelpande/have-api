const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");

class RecommendationService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async getFoodRecommendation() {
    const query = {
      text: "SELECT id, name, calories, img_url FROM foodrecomendation",
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("No food recommendations found");
    }

    return result.rows;
  }

  async getExerciseRecommendation() {
    const query = {
      text: "SELECT id, name, calories, img_url FROM exerciserecomendation",
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("No exercise recommendations found");
    }

    return result.rows;
  }
}

module.exports = RecommendationService;
