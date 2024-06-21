const CaloriesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "calories",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const caloriesHandler = new CaloriesHandler(service, validator);
    server.route(routes(caloriesHandler));
  },
};
