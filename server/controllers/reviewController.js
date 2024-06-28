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

exports.review_list = asyncHandler(async (req, res, next) => {
    try {
        const [allPostyplenie, allReviews] = await Promise.all([
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
            await Review.findAll({
                include:
                [
                    {
                        model: OrganizationCustomer,
                        as: 'organizationCustomer',
                        attributes: [],   
                        required:false
                    },
                    {
                        model: CommisionReciever,
                        as: 'commisionReciever',
                        attributes: [],   
                        required:false
                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: [],   
                        required:false
                    },
                    {
                        model: ProductType,
                        as: 'productType',
                        attributes: [],   
                        required:false
                    },
                    {
                        model: Payee,
                        as: 'payee',
                        attributes: [],   
                        required:false
                    }
                ]
            }),
        ]);
        allReviews.forEach(async (review) => {
            if(review.dataType === 'Заказы'){
                const historyOrders = await History.findAll({
                    where: {
                        orderStatus: review.orderReviewStatus,

                    },
                    include: [
                        {
                            model: OrganizationCustomer,
                            where: {
                                id: review.organizationCustomerId
                            },
                            include: [
                                {
                                    model: Order,
                                    include: [
                                        {
                                            model: Payee,
                                            as: 'payee',
                                            attributes: [],
                                        },
                                        {
                                            model: TitleOrders,
                                            include: [
                                              {
                                                model: PriceDefinition,
                                                as: "price",
                                                attributes: []
                                              },
                                              {
                                                model: Product,
                                                where: {
                                                    productTypeId: {
                                                        [Op.ne]: 4
                                                    }
                                                },
                                                as: "product",
                                                attributes: []
                                              },
                                            ],
                                            attributes: []
                                          }
                                    ],
                                    attributes: [],
                                    as: 'orders'
                                }
                            ],
                            as: 'organizationCustomer',
                            attributes: [],
                        }
                    ],
                    attributes:{
                        include:
                        [
                            [
                                Sequelize.literal(
                                    `(SUM(CASE WHEN  addBooklet = TRUE THEN quantity * priceBooklet WHEN addBooklet = FALSE  THEN quantity * priceAccess  END))`
                                  ),
                                  "sumOfOrders", 
                            ],
                            [
                                Sequelize.literal(
                                    `COUNT (*)`
                                  ),
                                  "quantityOfOrders", 
                            ]
                        ]
                    },
                    raw: true,
                    group: ["History.id"]
                }) 
                console.log(historyOrders)
            }
            else if(review.dataType === 'Товары'){
                const historyProducts = await History.findAll({
                    where: {
                        orderStatus: review.orderReviewStatus,

                    },
                    include: [
                        {
                            model: OrganizationCustomer,
                            include: [
                                {
                                    model: Order,
                                    include: [
                                        {
                                            model: Payee,
                                            as: 'payee',
                                            attributes: [],
                                        },
                                        {
                                            model: TitleOrders,
                                            include: [
                                              {
                                                model: PriceDefinition,
                                                attributes: [],
                                                as: "price",
                                              },
                                              {
                                                model: Product,
                                                where: {
                                                    [Op.or]: [
                                                        {id: review.productId},
                                                        {productTypeId: review.productTypeId}
                                                    ]
                                                },
                                                attributes: [],
                                                as: "product",
                                              },
                                            ],
                                            attributes: [],
                                          }
                                    ],
                                    attributes: []
                                }
                            ],
                            as: 'organizationCustomer',
                            attributes: [],
                        }
                    ],
                    attributes:{
                        include:
                        [
                            [
                                Sequelize.literal(
                                    `(SUM(CASE WHEN  addBooklet = TRUE THEN quantity * priceBooklet WHEN addBooklet = FALSE  THEN quantity * priceAccess  END))`
                                  ),
                                  "sumOfProds", 
                            ],
                            [
                                Sequelize.literal(
                                    `SUM (quantity)`
                                  ),
                                  "quantityOfProds", 
                            ]
                        ]
                    }
                }) 
            }
            else {

            }
        })



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
            allReviews: allReviews,
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: 'Ой, что - то пошло не так!'})
    }
});

exports.review_create_get = asyncHandler(async (req, res, next) => {
    try{
        const [
            allOrganizations,
            allProducts,
            allProductTypes,
            allPayees,
            allCommisionRecievers,
        ] = await Promise.all([
            OrganizationCustomer.findAll(),
            Product.findAll(),
            ProductType.findAll(),
            Payee.findAll(),
            CommisionReciever.findAll(),
        ]);
        logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Форма создания отчета!`
          );
        res.json({
            title: "Форма создания отчета",
            allOrganizations: allOrganizations,
            allProducts: allProducts,
            allProductTypes: allProductTypes,
            allPayees: allPayees,
            allCommisionRecievers: allCommisionRecievers,
        });
    }
    catch(err){
        logger.error(err);
        res.status(500).json({message: 'Ой, что - то пошло не так!'})
    }
    
});

exports.review_create_post = [
    body("name", "Название должно быть указано")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("dataType", "dataType должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("organizationCustomerId", "organizationCustomerId должен быть указан")
        .escape(),
    body("orderReviewStatus", "Статус должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("payeeId")
        .optional({ nullable: true })
        .escape(),
    body("productTypeId")
        .optional({ nullable: true })
        .escape(),
    body("productId")
        .optional({ nullable: true })
        .escape(),
    body("commisionRecieverId")
        .optional({ nullable: true })
        .escape(),

    asyncHandler(async (req, res, next) => {
        try{
            const errors = validationResult(req);
            const review = new Review({
                name: req.body.name,
                dataType: req.body.dataType,
                organizationCustomerId: req.body.organizationCustomerId,
                orderReviewStatus: req.body.orderReviewStatus,
                payeeId: req.body.payeeId,
                productTypeId: req.body.productTypeId,
                productId: req.body.productId,
                commisionRecieverId: req.body.commisionRecieverId
            })
            if (!errors.isEmpty()) {
                logger.error(errors.array());
                res.json({
                    title: "Некорректная форма создания отчета!",
                    review: review,
                    errors: errors.array(),
                });
            } else {
                await review.save();
                logger.info(
                    `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Отчет успешно создан!`
                  );
                res.status(200).send("Отчет успешно создан!");
            }
        }
        catch(err){
            logger.error(err);
            res.status(500).json({message: 'Ой, что - то пошло не так!'})
        }
        
    }),
];
