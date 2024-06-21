const routes = (handler) => [
  {
    method: 'POST',
    path: '/calories',
    handler: handler.postCalorieHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        parse: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/calories',
    handler: handler.getCaloriesHandler,
  },
  {
    method: 'DELETE',
    path: '/calories/{id}',
    handler: handler.deleteCalorieHandler,
  },
  {
    method: 'PUT',
    path: '/calories/{id}',
    handler: handler.updateCalorieHandler,
  },
  {
    method: 'GET',
    path: '/calories/{id}/image',
    handler: handler.getCalorieImageHandler, // Add this line
  },
  {
    method: 'GET',
    path: '/calories/top3',
    handler: handler.getTopCaloriesHandler,
  },
  {
    method: 'GET',
    path: '/calories/overview',
    handler: handler.getCaloriesOverviewHandler,
  },
];

module.exports = routes;
