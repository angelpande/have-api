/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require("../../exceptions/ClientError");
const ErrorChecker = require("../../utils/ErrorChecker");

class UsersHandler {
  constructor(service, validator, auth, tokenManager) {
    this._tokenManager = tokenManager;
    this._service = service;
    this._auth = auth;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { fullname, username, email, password } = request.payload;
      const userId = await this._service.addUser({
        fullname,
        username,
        email,
        password,
      });

      const token = this._tokenManager.generateToken({ id: userId });

      await this._auth.addToken(userId, token, username); // Pass username here

      const response = h.response({
        status: "Success",
        message: "Registration Successful",
        data: {
          userId,
          username,  // Include username in the response
          token,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = UsersHandler;