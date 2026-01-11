const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Apartment Management System API",
      version: "1.0.0",
      description: "AMS APIs with JWT Authentication",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    // 🔐 ADD THIS PART
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔐 GLOBAL SECURITY (can override per route)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
