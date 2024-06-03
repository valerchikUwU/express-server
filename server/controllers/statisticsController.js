const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');


exports.sells_list = asyncHandler(async (req, res, next) => {
    const [orders] = await Promise.all([
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
