// Импортируем Swagger JSDoc для документирования API с использованием JSDoc комментариев
const swaggerJSDoc = require("swagger-jsdoc");

// Корень URL
const API_ROOT = process.env.API_ROOT;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for electron-app",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from electron-app.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "electron-app",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: API_ROOT,
      description: "Development server",
    },
  ],
  tags: [
    { name: "Account" },
    { name: "AccrualRule" },
    { name: "CommisionReciever" },
    { name: "Order" },
    { name: "OrganizationCustomer" },
    { name: "Payee" },
    { name: "PriceDefinition" },
    { name: "Product" },
    { name: "ProductType" },
    { name: "Role" },
    { name: "TitleOrders" },
    { name: "Authentication" },
    { name: "Statistics" },
    { name: "CommisionRecieverOperations" },
    { name: "WebPush" },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["../docs/*.js"],
};

module.exports = swaggerJSDoc(options);
