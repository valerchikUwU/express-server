const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');
const OrganizationCustomer = require('../../models/organizationCustomer');
const { logger } = require("../../configuration/loggerConf")


exports.sells_list = asyncHandler(async (req, res, next) => {
    const [orders] = await Promise.all([
        Order.findAll({
            where:
            {
                status:
                {
                    [Op.in]:
                        [
                            'Отправлен',
                            'Получен'
                        ]
                }
            },

            include:
                [
                    {
                        model: TitleOrders,
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    attributes: [],
                                    as: 'price'
                                }
                            ],
                        attributes: []
                    },
                    {
                        model: OrganizationCustomer,
                        as: 'organization',
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
                            Sequelize.literal(`dispatchDate`), 'dispatchDate'
                        ],
                        [
                            Sequelize.literal(`organizationName`), 'organizationName'
                        ]
                    ]
            },

            group: ['Order.id'],
            raw: true
        })
    ]);



    res.json({
        title: "Статистика продаж",
        orders: orders,
    });
});
