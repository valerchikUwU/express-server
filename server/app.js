//Переменные среды
require("dotenv").config({ path: "../.env" });

const webpush = require("web-push");


const path = require("path");
// Импортируем Express, фреймворк для создания веб-приложений на Node.js
const express = require("express");

// Импортируем модуль для сжатия ответов сервера, что улучшает производительность
const compression = require("compression");

// Импортируем модуль для управления CORS (Cross-Origin Resource Sharing), позволяющий безопасно делать запросы между доменами
const cors = require("cors");

// Импортируем Swagger JSDoc для документирования API с использованием JSDoc комментариев
const swaggerJSDoc = require("swagger-jsdoc");

// Импортируем Swagger UI Express для отображения документации API в веб-интерфейсе
const swaggerUi = require("swagger-ui-express");

// Импортируем модуль Helmet для защиты приложения от некоторых видов атак
const helmet = require("helmet");

// Импортируем маршруты аутентификации
const authRoutes = require("./routes/authRoutes");

// Импортируем все маршруты приложения
const allRoutes = require("./routes/allRoutes");

// Импортируем все маршруты для уведомлений
const pushRoutes = require("./routes/pushRoutes");

// Создаем экземпляр приложения Express
const app = express();

require("../database/connection");
require("../models/associations/associations.js");

const Account = require("../models/account.js");
const Role = require("../models/role.js");
const Payee = require("../models/payee.js");
const ProductType = require("../models/productType.js");
const Product = require("../models/product.js");
const PriceDefinition = require("../models/priceDefinition.js");
const CommisionReciever = require("../models/commisionReceiver.js");
const OrganizationCustomer = require("../models/organizationCustomer.js");
const Order = require("../models/order.js");
const TitleOrders = require("../models/titleOrders.js");
const AccrualRule = require("../models/accrualRule.js");
const CommisionRecieverOperations = require("../models/commisionRecieverOperations.js");
const Subscriptions = require("../models/subscriptions.js");

// Корень URL
const API_ROOT = process.env.API_ROOT;

// Импортируем модуль для сессий
const session = require("express-session");
const Review = require("../models/review.js");

// Импортируем модуль для создания хранилища сессий
const MySQLStore = require("express-mysql-session")(session);

// Опции хранилища
const optionsStore = {
  host: process.env.host,
  port: process.env.port,
  user: process.env.db_user,
  password: process.env.password,
  database: process.env.db_name,
  // Whether or not to automatically check for and clear expired sessions:
  clearExpired: true,
  // How frequently expired sessions will be cleared; milliseconds:
  checkExpirationInterval: 360000000,
  // The maximum age of a valid session; milliseconds:
  expiration: 86400000,
  // Whether or not to create the sessions database table, if one does not already exist:
  createDatabaseTable: true,
  // Whether or not to end the database connection when the store is closed.
  // The default value of this option depends on whether or not a connection was passed to the constructor.
  // If a connection object is passed to the constructor, the default value for this option is false.
  endConnectionOnClose: true,
};

// Создание хранилища
const sessionStore = new MySQLStore(optionsStore);




async function syncModels() {
  try {
    await Role.sync();
    await Account.sync();
    await Payee.sync();
    await ProductType.sync();
    await OrganizationCustomer.sync();
    await Product.sync();
    await PriceDefinition.sync();
    await CommisionReciever.sync();
    await Order.sync();
    await TitleOrders.sync();
    await AccrualRule.sync();
    await CommisionRecieverOperations.sync();
    await Review.sync();
    await Subscriptions.sync();
    console.log("Syncronized successfully");
  } catch (error) {
    console.error("Error due to failed sycnronization:", error);
  }
}

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

const swaggerSpec = swaggerJSDoc(options);

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// // Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require("express-rate-limit");
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });
// // Apply rate limiter to all requests
// app.use(limiter);

// Включаем CORS для всех маршрутов
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Настройка сессии
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Секретный ключ для подписи сессии
    store: sessionStore,
    resave: false, // Не сохранять сессию при каждом запросе, если она не изменилась
    saveUninitialized: false, // Сохранять сессию, если она была инициализирована, но не изменена
    cookie: {
      secure: false, // Используйте true, если ваш сайт работает через HTTPS
      httpOnly: true, // Рекомендуется для повышения безопасности
      maxAge: 365 * 24 * 60 * 60 * 1000, // 24 часа, время жизни cookies
    },
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.use("/pwa", express.static(path.join(__dirname, "../../PWA")));
  app.use("/desktop", express.static(path.join(__dirname, "../../build")));
}
app.use("/api", authRoutes);
app.use("/api", allRoutes);
app.use("/api", pushRoutes);

// Запуск Express сервера
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  syncModels();
  //  checkDatabaseConnection();
  console.log(`Server is running on port ${PORT}`);
});
