const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');
const Review = require('../../models/review');
const OrganizationCustomer = require('../../models/organizationCustomer');
const ProductType = require('../../models/productType');
const Payee = require('../../models/payee');
const CommisionReciever = require('../../models/commisionReceiver');
const sequelize = require('../../database/connection');
const dateFns = require('date-fns');


exports.review_list = asyncHandler(async (req, res, next) => {
    try {
        const [allPostyplenie, allReviews] = await Promise.all([
            Order.findAll({
                where:
                {
                    status:
                    {
                        [Op.in]:
                            [
                                'Оплачен',
                                'Отправлен',
                                'Получен'
                            ]
                    }
                },

                group: ['dispatchDate'],
                include:
                    [
                        {
                            model: TitleOrders, // Добавляем модель TitleOrders
                            include:
                                [
                                    {
                                        model: PriceDefinition,
                                        as: 'price',
                                        attributes: []
                                    },
                                    {
                                        model: Product,
                                        attributes: [],
                                        as: 'product'
                                    }
                                ],
                            attributes: []
                        }
                    ],
                attributes:
                {
                    include:
                        [
                            [
                                Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                            ],
                            [
                                Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`), 'totalQuantity'
                            ],
                            [
                                Sequelize.literal(`SUM(CASE WHEN productTypeId = 2 THEN (quantity*1) END)`), 'totalMainQuantity'
                            ]
                        ]
                },
                raw: true
            }),
            await Review.findAll()
        ])
        allPostyplenie.forEach(order => {
            order.formattedDispatchDate = order.dispatchDate ? dateFns.format(order.dispatchDate, 'dd-MM-yyyy') : null;
        });
        res.json({
            title: 'Все отчеты',
            allPostyplenie: allPostyplenie,
            allReviews: allReviews
        })
    }
    catch (err) {
        console.log(err)
    }

})



exports.review_create_get = asyncHandler(async (req, res, next) => {
    const [allOrganizations, allProducts, allProductTypes, allPayees, allCommisionRecievers] = await Promise.all([
        OrganizationCustomer.findAll(),
        Product.findAll(),
        ProductType.findAll(),
        Payee.findAll(),
        CommisionReciever.findAll()
    ]);

    res.json({
        title: "Форма создания отчета",
        allOrganizations: allOrganizations,
        allProducts: allProducts,
        allProductTypes: allProductTypes,
        allPayees: allPayees,
        allCommisionRecievers: allCommisionRecievers,
    });
});



exports.ordersReview_create_post = [

    body("name", "Название должно быть указано")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("organizationCustomerIds", "organizationCustomerIds должен быть массивом идентификаторов")
        .custom(ids => {
            if (!Array.isArray(ids)) {
                throw new Error('organizationCustomerIds должен быть массивом');
            }
            if (ids.length === 0) {
                throw new Error('organizationCustomerIds должен содержать хотя бы одно значение');
            };
            return true;
        })
        .escape(),
    body("status", "Статус должен быть указан")
        .isInt({ min: 1 })
        .escape(),
    body("payeeIds", "payeeIds должен быть указан")
        .custom(ids => {
            if (!Array.isArray(ids)) {
                throw new Error('payeeIds должен быть массивом');
            }
            if (ids.length === 0) {
                throw new Error('payeeIds должен содержать хотя бы одно значение');
            };
            return true;
        })
        .escape(),
    body("dataType", "dataType должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("viewType", "viewType должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const viewType = req.body.viewType;






        if (!errors.isEmpty()) {

            res.json({
                title: "Некорректная форма создания отчета!",
                errors: errors.array(),
            });
        }
        else {

            if (viewType === 'Количество заказов') {
                const order = await Order.findAll({
                    where:
                    {
                        status: req.body.status,
                        organizationCustomerId:
                        {
                            [Op.in]:
                                [
                                    req.body.organizationCustomerId
                                ]
                        },
                        payeeId:
                        {
                            [Op.in]:
                                [
                                    req.body.payeeId
                                ]
                        }
                    },
                    attributes:
                    {
                        include:
                            [

                                [
                                    sequelize.fn('count', sequelize.col('Order.id')), 'count'
                                ]
                            ]
                    },
                })

                const review = new Review({
                    name: req.body.name,
                    dataType: req.body.dataType
                    // calculatedNumber: 
                })
            }
            else {
                const order = await Order.findAll({
                    where:
                    {
                        status: req.body.status,
                        organizationCustomerId:
                        {
                            [Op.in]:
                                [
                                    req.body.organizationCustomerId
                                ]
                        },
                        payeeId:
                        {
                            [Op.in]:
                                [
                                    req.body.payeeId
                                ]
                        }
                    },
                    include:
                        [
                            {
                                model: TitleOrders, // Добавляем модель TitleOrders
                                include:
                                    [
                                        {
                                            model: PriceDefinition,
                                            as: 'price',
                                            attributes: []
                                        },
                                        {
                                            model: Product,
                                            attributes: [],
                                            as: 'product'
                                        }
                                    ],
                                attributes: []
                            }
                        ],
                    attributes:
                    {
                        include:
                            [
                                [
                                    Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 THEN (CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END) END)`), 'SUM'
                                ]
                            ]
                    },
                })
            }

            const orderReview = new Review({

            })
            res.status(200).send("Прайс лист успешно создан!");
        }
    }),
];
