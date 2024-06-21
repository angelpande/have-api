const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
  generateToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  verifyToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifacts, process.env.ACCESS_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Invalid Token");
    }
  },
};

module.exports = TokenManager;
