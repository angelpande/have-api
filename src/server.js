require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Jwt = require("@hapi/jwt");

// Users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// Authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// Calories
const calories = require("./api/calories");
const CaloriesService = require("./services/postgres/CaloriesService");
const caloriesValidator = require("./validator/calories");

// Sleeps
const sleeps = require("./api/sleeps");
const SleepsService = require("./services/postgres/SleepsService");
const sleepsValidator = require("./validator/sleeps");

// Activity
const activity = require("./api/activity");
const ActivityService = require("./services/postgres/ActivityService");
const activityValidator = require("./validator/activity");

// Recommendation
const recommendation = require("./api/recommendation");
const RecommendationService = require("./services/postgres/RecommendationService");

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const caloriesService = new CaloriesService();
  const sleepsService = new SleepsService();
  const activityService = new ActivityService();
  const recommendationService = new RecommendationService();

  const server = new Hapi.Server({
    port: 5000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Register external plugins
  await server.register([
    {
      Inert,
      Vision,
      plugin: Jwt,
    },
  ]);

  // Define JWT authentication strategy
  server.auth.strategy("have_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
        auth: authenticationsService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: calories,
      options: {
        service: caloriesService,
        validator: caloriesValidator,
      },
    },
    {
      plugin: sleeps,
      options: {
        service: sleepsService,
        validator: sleepsValidator,
      },
    },
    {
      plugin: activity,
      options: {
        service: activityService,
        validator: activityValidator,
      },
    },
    {
      plugin: recommendation,
      options: {
        service: recommendationService,
      },
    },
  ]);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
