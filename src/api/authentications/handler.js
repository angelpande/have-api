/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ErrorChecker = require("../../utils/ErrorChecker");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this._errorCheck = ErrorChecker;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      const token = this._tokenManager.generateToken({ id });

      await this._authenticationsService.addToken(id, token, username); // Pass username here
      const response = h.response({
        status: "success",
        message: "Login Successful",
        data: {
          token,
          username,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      await this._authenticationsService.deleteToken(id);

      const response = h.response({
        status: "Success",
        message: "Logout Successful",
      });

      response.code(201);
      return response;
    } catch (error) {
      return this._errorCheck.errorHandler(h, error);
    }
  }
}

module.exports = AuthenticationsHandler;
