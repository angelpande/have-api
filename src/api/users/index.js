const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { service, validator, auth, tokenManager }) => {
    console.log('tokenManager:', tokenManager); // Add this line
    console.log('tokenManager.generateToken:', typeof tokenManager.generateToken); // Should output 'function'
    const usersHandler = new UsersHandler(service, validator, auth, tokenManager);
    server.route(routes(usersHandler));
  },
};
