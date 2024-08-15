const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const PriceDefinition = require("../../models/priceDefinition");
const Product = require("../../models/product");
const Review = require("../../models/review");
const OrganizationCustomer = require("../../models/organizationCustomer");
const ProductType = require("../../models/productType");
const Payee = require("../../models/payee");
const CommisionReciever = require("../../models/commisionReceiver");
const sequelize = require("../../database/connection");
const dateFns = require("date-fns");
const { logger } = require("../../configuration/loggerConf");
const History = require("../../models/history.js");
const chalk = require("chalk");
const CommisionRecieverOperations = require("../../models/commisionRecieverOperations.js");

exports.review_list = asyncHandler(async (req, res, next) => {
    try {
        const [allPostyplenie, allOrganizations, allCommisionRecievers] = await Promise.all([
            History.findAll({
                where: {
                    orderStatus: "Оплачен",
                },
                group: ["timestamp"],
                include: [
                    {
                        model: Order,
                        include: [
                            {
                                model: TitleOrders, // Добавляем модель TitleOrders
                                include: [
                                    {
                                        model: PriceDefinition,
                                        as: "price",
                                        attributes: [],
                                    },
                                    {
                                        model: Product,
                                        attributes: [],
                                        as: "product",
                                    },
                                ],
                                attributes: [],
                            },
                        ],
                        as: "order",
                        attributes: [],
                    },
                ],
                attributes: {
                    include: [
                        [
                            Sequelize.literal(
                                `SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`
                            ),
                            "SUM",
                        ],
                        [
                            Sequelize.literal(
                                `SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`
                            ),
                            "totalQuantity",
                        ],
                        [
                            Sequelize.literal(
                                `SUM(CASE WHEN productTypeId = 2 THEN (quantity*1) END)`
                            ),
                            "totalMainQuantity",
                        ],
                    ],
                },
                raw: true,
            }),
            OrganizationCustomer.findAll(),
            CommisionReciever.findAll()
        ]
        )



        allPostyplenie.forEach((history) => {
            history.formattedDispatchDate = history.timestamp
                ? dateFns.format(history.timestamp, "dd.MM.yyyy")
                : null;
        });


        logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Все отчеты!`
        );
        res.json({
            title: "Все отчеты",
            allPostyplenie: allPostyplenie,
            allOrganizations: allOrganizations,
            allCommisionRecievers: allCommisionRecievers
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Ой, что - то пошло не так!' })
    }
});


exports.review_organizationInfo_get = asyncHandler(async (req, res, next) => {
    try {
        const [allOrders, allProducts] = await Promise.all([
            History.findAll({
            where: { organizationCustomerId: req.params.organizationCustomerId },
            group: ["timestamp"],
            include: [
                {
                    model: Order,
                    include: [
                        {
                            model: TitleOrders, // Добавляем модель TitleOrders
                            include: [
                                {
                                    model: PriceDefinition,
                                    as: "price",
                                    attributes: ["priceAccess", "priceBooklet"],
                                },
                                {
                                    model: Product,
                                    attributes: ["id", "name", "abbreviation", "productTypeId"],
                                    as: "product",
                                },
                            ],
                            attributes: ["addBooklet", "quantity"],
                        },
                    ],
                    as: "order",
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`
                        ),
                        "SUM",
                    ],
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`
                        ),
                        "totalQuantity",
                    ],
                ],
            },
        }),
        Product.findAll({
            include: [
                {
                    model: TitleOrders,
                    include: [
                        {
                            model: Order,
                            attributes: [],
                        },
                        {
                            model: PriceDefinition,
                            as: "price",
                            attributes: [],
                        },
                    ],
                    as: 'titles'
                },
            ],
        })
        ])




        logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Все отчеты по организации!`
        );
        res.json({
            title: "Все отчеты по конкретной организации",
            allOrders: allOrders,
            allProducts: allProducts
        });
    }
    catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Ой, что - то пошло не так!' })
    }
})






exports.review_commisionRecieverInfo_get = asyncHandler(async (req, res, next) => {
    try {
        const commisionReceiver = await CommisionReciever.findByPk(
          req.params.commisionRecieverId
        );
        const commisionReceiverOperations =
          await CommisionRecieverOperations.findAll({
            where: { commisionRecieverId: req.params.commisionRecieverId },
            raw: true,
          });
  
        commisionReceiverOperations.forEach((row) => {
          row.formattedDate = row.dateOfOperation
            ? dateFns.format(row.dateOfOperation, "dd.MM.yyyy")
            : null;
        });
  
        if (commisionReceiver === null) {
          // No results.
          const err = new Error("Получатель комиссии не найден!");
          err.status = 404;
          return next(err);
        }
        res.json({
          title: `Баланс получателя комиссии ${commisionReceiver.name}`,
          commisionReceiver:
            commisionReceiver,
          operations:
            commisionReceiverOperations
        });
  
      } catch (err) {
        err.ip = req.ip;
        logger.error(err);
  
        if (err.status === 404) {
          res.status(404).json({ message: err.message });
        }
        res.status(500).json({ message: "Ой, что - то пошло не так" });
      }
});


// exports.review_create_get = asyncHandler(async (req, res, next) => {
//     try {
//         const [
//             allOrganizations,
//             allProducts,
//             allProductTypes,
//             allPayees,
//             allCommisionRecievers,
//         ] = await Promise.all([
//             OrganizationCustomer.findAll(),
//             Product.findAll(),
//             ProductType.findAll(),
//             Payee.findAll(),
//             CommisionReciever.findAll(),
//         ]);
//         logger.info(
//             `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Форма создания отчета!`
//         );
//         res.json({
//             title: "Форма создания отчета",
//             allOrganizations: allOrganizations,
//             allProducts: allProducts,
//             allProductTypes: allProductTypes,
//             allPayees: allPayees,
//             allCommisionRecievers: allCommisionRecievers,
//         });
//     }
//     catch (err) {
//         logger.error(err);
//         res.status(500).json({ message: 'Ой, что - то пошло не так!' })
//     }

// });

// exports.review_create_post = [
//     body("name", "Название должно быть указано")
//         .trim()
//         .isLength({ min: 1 })
//         .escape(),
//     body("dataType", "dataType должен быть указан")
//         .trim()
//         .isLength({ min: 1 })
//         .escape(),
//     body("organizationCustomerId", "organizationCustomerId должен быть указан")
//         .escape(),
//     body("orderReviewStatus", "Статус должен быть указан")
//         .trim()
//         .isLength({ min: 1 })
//         .escape(),
//     body("payeeId")
//         .optional({ nullable: true })
//         .escape(),
//     body("productTypeId")
//         .optional({ nullable: true })
//         .escape(),
//     body("productId")
//         .optional({ nullable: true })
//         .escape(),
//     body("commisionRecieverId")
//         .optional({ nullable: true })
//         .escape(),

//     asyncHandler(async (req, res, next) => {
//         try {
//             const errors = validationResult(req);
//             const review = new Review({
//                 name: req.body.name,
//                 dataType: req.body.dataType,
//                 organizationCustomerId: req.body.organizationCustomerId,
//                 orderReviewStatus: req.body.orderReviewStatus,
//                 payeeId: req.body.payeeId,
//                 productTypeId: req.body.productTypeId,
//                 productId: req.body.productId,
//                 commisionRecieverId: req.body.commisionRecieverId
//             })
//             if (!errors.isEmpty()) {
//                 logger.error(errors.array());
//                 res.json({
//                     title: "Некорректная форма создания отчета!",
//                     review: review,
//                     errors: errors.array(),
//                 });
//             } else {
//                 await review.save();
//                 logger.info(
//                     `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Отчет успешно создан!`
//                 );
//                 res.status(200).send("Отчет успешно создан!");
//             }
//         }
//         catch (err) {
//             logger.error(err);
//             res.status(500).json({ message: 'Ой, что - то пошло не так!' })
//         }

//     }),
// ];
