const ClientError = require("../exceptions/ClientError");

module.exports = {
  errorHandler: (h, error) => {
    if (error instanceof ClientError) {
      const response = h.response({
        status: "Fail",
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    // server ERROR!
    const response = h.response({
      status: "Error",
      message: "Sorry, there was a failure on our server.",
    });
    response.code(500);
    console.error(error);
    return response;
  },
};
