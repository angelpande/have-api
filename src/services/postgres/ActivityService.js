// ActivityService.js

/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid'); // Pastikan ini diimpor di bagian atas file
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivityService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async addActivity({ name, duration }) {
    const id = `activity-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO activity (id, name, duration, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, duration, created_at, updated_at],
    };
    console.log("Running query:", query);

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add activity data');
    }

    return result.rows[0].id;
  }

  // Updated getActivity method
  async getLatestActivity() {
    const query = {
      text: 'SELECT * FROM activity ORDER BY created_at DESC LIMIT 1',
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('No activity data found');
    }

    return result.rows[0];
  }

  async getAllActivity() {
    const query = {
      text: 'SELECT * FROM activity',
    };

    const result = await this._pool.query(query);
    console.log('getAllActivity result:', result.rows); // Debug log
    return result.rows; // Ensure it returns an array
  }
}

module.exports = ActivityService;
