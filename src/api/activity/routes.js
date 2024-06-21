const routes = (handler) => [
  {
    method: 'POST',
    path: '/activity',
    handler: handler.postActivityHandler,
  },
  {
    method: 'GET',
    path: '/activity/upcoming',
    handler: handler.getActivityHandler,
  },
  {
    method: 'GET',
    path: '/activity',
    handler: handler.getAllActivityHandler,
  },
];

module.exports = routes;
