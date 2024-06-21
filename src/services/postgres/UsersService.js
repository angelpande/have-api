/* eslint-disable no-underscore-dangle */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
  }

  async addUser({ fullname, username, email, password }) {
    await this.verifyNewEmail(email);
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const query = {
      text: "INSERT INTO users (id, fullname, username, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, fullname, username, email, hashedPassword, created_at, updated_at],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("The data entered is incomplete");
    }

    return result.rows[0].id;
  }

  async verifyNewEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Failed, Email Already Used.");
    }
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Failed, Username Already Used.");
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, fullname, username, email, password FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User Not Found");
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("The username you provided is incorrect");
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("The password you provided is incorrect");
    }

    return id;
  }
}

module.exports = UsersService;
