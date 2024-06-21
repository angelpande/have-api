const routes = (handler) => [
  {
    method: 'POST',
    path: '/sleeps',
    handler: handler.postSleepHandler,
  },
  {
    method: 'GET',
    path: '/sleeps',
    handler: handler.getSleepHandler,
  },
  {
    method: "GET",
    path: "/sleeps/duration",
    handler: handler.getSleepDurationHandler,
  },

];
  
module.exports = routes;
