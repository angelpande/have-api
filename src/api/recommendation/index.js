const RecommendationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'recommendations',
  version: '1.0.0',
  register: async (server, { service }) => {
    const recommendationHandler = new RecommendationHandler(service);
    server.route(routes(recommendationHandler));
  },
};
