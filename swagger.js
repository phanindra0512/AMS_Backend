const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation for OTP authentication and other routes",
    },
    servers: [
      {
        url: "http://localhost:5000", // update this when deployed
      },
    ],
  },
  // Path to route files
  apis: ["./routes/*.js"], // all route files will be scanned for docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
