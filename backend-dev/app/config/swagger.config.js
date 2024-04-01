const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Device Management Backend",
      version: "1.0.0",
      description:
        "APIs for registering, monitoring and managing Industrial Gateways & Devices",
    },
    components: {
      securitySchemes: {
        /* Authorization: {
             type: "http",
             scheme: "bearer",
             bearerFormat: "JWT",
             value: "Bearer <JWT token here>"
           }*/
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-access-token"
        },
      },
    },
  },
  apis: ["./app/routes/*.js"], // Path to the API docs
};

module.exports = options;
