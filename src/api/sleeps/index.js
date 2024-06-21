const SleepsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "sleeps",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const sleepsHandler = new SleepsHandler(service, validator);
    server.route(routes(sleepsHandler));
  },
};
