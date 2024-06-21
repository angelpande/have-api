const routes = (handler) => [
  {
    method: 'GET',
    path: '/recommendations/food',
    handler: handler.getFoodRecommendationHandler,
    options: {
      auth: "have_jwt",
    },
  },
  {
    method: 'GET',
    path: '/recommendations/exercise',
    handler: handler.getExerciseRecommendationHandler,
    options: {
      auth: "have_jwt",
    },
  },
];

module.exports = routes;
