/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async addToken(userId, token, username) {
    const query = {
      text: `
        INSERT INTO authentications(user_id, token, username)
        VALUES($1, $2, $3)
        ON CONFLICT (user_id) DO UPDATE
        SET token = EXCLUDED.token, username = EXCLUDED.username
      `,
      values: [userId, token, username],
    };
    await this._pool.query(query);
  }

  async verifyToken(userId, token) {
    const query = {
      text: "SELECT token FROM authentications WHERE user_id = $1 AND token = $2",
      values: [userId, token],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Invalid Token");
    }
  }

  async deleteToken(userId) {
    const query = {
      text: "DELETE FROM authentications WHERE user_id = $1",
      values: [userId],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
