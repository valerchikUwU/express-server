//Переменные среды
require("dotenv").config({ path: "../.env" });
require('winston-daily-rotate-file');

const webpush = require("web-push");

const winston = require('winston');

const morgan = require('morgan');

const path = require("path");
// Импортируем Express, фреймворк для создания веб-приложений на Node.js
const express = require("express");

// Импортируем модуль для сжатия ответов сервера, что улучшает производительность
const compression = require("compression");

// Импортируем модуль для управления CORS (Cross-Origin Resource Sharing), позволяющий безопасно делать запросы между доменами
const cors = require("cors");

// В начале файла app.js
const swaggerSpec = require('../configuration/swaggerConf.js');


// Импортируем Swagger UI Express для отображения документации API в веб-интерфейсе
const swaggerUi = require("swagger-ui-express");

// Импортируем модуль Helmet для защиты приложения от некоторых видов атак
const helmet = require("helmet");

// В начале файла app.js
const { sessionStore } = require('../configuration/sessionsConf.js');

const session = require("express-session");


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
const Image = require("../models/image.js")



// Импортируем модуль для сессий
const Review = require("../models/review.js");

// Импортируем модуль для создания хранилища сессий

const { combine, timestamp, json, errors } = winston.format;


const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});


const combinedFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'DD-MM-YYYY',
  maxFiles: '30d',
});

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'app-error-%DATE%.log',
  level: 'error',
  datePattern: 'DD-MM-YYYY',
  maxFiles: '30d',
  format: combine(errorFilter(), timestamp(), json()),
});


const infoFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'app-info-%DATE%.log',
  level: 'info',
  datePattern: 'DD-MM-YYYY',
  maxFiles: '30d',
  format: combine(infoFilter(), timestamp(), json()),
});

const logger = winston.createLogger({
  exitOnError: false,
  level: 'http',
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'DD-MM-YYYY hh:mm:ss.SSS A',
    }),
    json(),
  ),
  transports: [combinedFileRotateTransport, errorFileRotateTransport, infoFileRotateTransport],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
  ],
});


const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);







async function syncModels() {
  try {
    await Role.sync();
    await Account.sync();
    await Payee.sync();
    await ProductType.sync();
    await OrganizationCustomer.sync();
    await Image.sync();
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
app.use(morganMiddleware);
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
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
      maxAge: 365 * 24 * 60 * 60 * 1000, // 365 дней, время жизни cookies
    },
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.use("/pwa", express.static(path.join(__dirname, "../../PWA")));
  app.use("/desktop", express.static(path.join(__dirname, "../../build")));
}
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
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
