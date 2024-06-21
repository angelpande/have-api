const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CaloriesService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async addCalorie({ image, foodname, calories }) {
    const id = `calorie-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO calories (id, image, foodname, calories, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, image, foodname, calories, created_at, updated_at],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('The data entered is incomplete');
    }

    return result.rows[0].id;
  }

  async getCalories(limit = 7) {
    const query = {
      text: 'SELECT id, image, foodname, calories, created_at, updated_at FROM calories ORDER BY created_at DESC LIMIT $1',
      values: [limit],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Calorie Not Found');
    }

    return result.rows;
  }

  async deleteCalorieById(calorieId) {
    const query = {
      text: 'DELETE FROM calories WHERE id = $1 RETURNING id',
      values: [calorieId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data not found');
    }

    return result.rows[0].id;
  }

  async updateCalorieById(calorieId, { foodname, calories }) {
    const updated_at = new Date().toISOString();
    const query = {
      text: 'UPDATE calories SET foodname = $1, calories = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [foodname, calories, updated_at, calorieId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Data not found');
    }

    return result.rows[0].id;
  }

  async getCalorieOverview(limit = 1) {
    const query = {
      text: 'SELECT id, image, foodname, calories, created_at, updated_at FROM calories ORDER BY created_at DESC LIMIT $1',
      values: [limit],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Calorie not found');
    }

    return result.rows[0];
  }

  async getTopCalories(limit = 3) {
    const query = {
      text: 'SELECT * FROM top3 ORDER BY calories DESC LIMIT $1',
      values: [limit],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('No calorie data found');
    }

    return result.rows;
  }
}

module.exports = CaloriesService;
