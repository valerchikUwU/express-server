//Переменные среды
require('dotenv').config({path: '../.env'});
const path = require('path');


// Импортируем Express, фреймворк для создания веб-приложений на Node.js
const express = require('express');

// Импортируем модуль для сжатия ответов сервера, что улучшает производительность
const compression = require("compression");

// Импортируем модуль для управления CORS (Cross-Origin Resource Sharing), позволяющий безопасно делать запросы между доменами
const cors = require('cors');

// Импортируем Swagger JSDoc для документирования API с использованием JSDoc комментариев
const swaggerJSDoc = require('swagger-jsdoc');

// Импортируем Swagger UI Express для отображения документации API в веб-интерфейсе
const swaggerUi = require('swagger-ui-express');

// Импортируем модуль Helmet для защиты приложения от некоторых видов атак
const helmet = require("helmet");

// Импортируем маршруты аутентификации
const authRoutes = require('./routes/authRoutes');

// Импортируем все маршруты приложения
const allRoutes = require('./routes/allRoutes');

// Создаем экземпляр приложения Express
const app = express();



require('../database/connection');
require('../models/associations/associations.js');


const Account = require('../models/account.js');
const Role = require('../models/role.js');
const Payee = require('../models/payee.js')
const ProductType = require('../models/productType.js');
const Product = require('../models/product.js');
const PriceDefinition = require('../models/priceDefinition.js');
const CommisionReciever = require('../models/commisionReceiver.js');
const OrganizationCustomer = require('../models/organizationCustomer.js');
const Order = require('../models/order.js');
const TitleOrders = require('../models/titleOrders.js');
const AccrualRule = require('../models/accrualRule.js');



// Корень URL
const API_ROOT = process.env.API_ROOT;

// Импортируем модуль для сессий
const session = require('express-session');

// Импортируем модуль для создания хранилища сессий
const MySQLStore = require('express-mysql-session')(session);

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
     console.log('Syncronized successfully');
  } catch (error) {
     console.error('Error due to failed sycnronization:', error);
  }
 }


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for electron-app',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from electron-app.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'electron-app',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: API_ROOT,
      description: 'Development server',
    },
  ],
  tags: [
    {name: 'Account'},
    {name: 'AccuralRule'},
    {name: 'CommisionReceiver'},
    {name: 'Order'},
    {name: 'OrganizationCustomer'},
    {name: 'Payee'},
    {name: 'PriceDefinition'},
    {name: 'Product'},
    {name: 'ProductType'},
    {name: 'Role'},
    {name: 'TitleOrders'},
    {name: 'Authentication'},
    {name: 'Statistics'}
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['../docs/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);



// // Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require("express-rate-limit");
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });
// // Apply rate limiter to all requests
// app.use(limiter);



// Включаем CORS для всех маршрутов

const corsOptions = {
	origin: 'https://arsen4ik228.github.io',
	credentials: true};
 
app.use(cors(corsOptions));
app.set('trust proxy', 1) // trust first proxy
app.use(express.json());


const cookieParser = require('cookie-parser');

app.use(cookieParser(process.env.SESSION_SECRET));
console.log(process.env.SESSION_SECRET);

// Настройка сессии
app.use(session({
  secret: process.env.SESSION_SECRET, // Секретный ключ для подписи сессии
  store: sessionStore,
  resave: false, // Не сохранять сессию при каждом запросе, если она не изменилась
  saveUninitialized: false, // Сохранять сессию, если она была инициализирована, но не изменена
  proxy: true,
  cookie: {
   httpOnly: true, secure: false} // Установите secure в true, если используете HTTPS
}));

app.use((req, res, next) =>  {

res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Allow-Origin', 'https://arsen4ik228.github.io');
next();
});


// Добавление статического хостинга для папки /root/PWA
app.use('/pwa', express.static(path.join(__dirname, '../../PWA')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', authRoutes);
app.use('/api', allRoutes );
 

// Запуск Express сервера
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
   syncModels();
  //  checkDatabaseConnection();
 console.log(`Server is running on port ${PORT}`);
});
