const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const PriceDefinition = require("../../models/priceDefinition");
const OrganizationCustomer = require("../../models/organizationCustomer");
const { logger } = require("../../configuration/loggerConf");
const History = require("../../models/history.js");
const chalk = require("chalk");

exports.sells_list = asyncHandler(async (req, res, next) => {
  try {
    const [orders] = await Promise.all([
      History.findAll({
        where: {
          orderStatus: "Оплачен",
        },

        include: [
          {
            model: Order,
            include: [
              {
                model: TitleOrders,
                include: [
                  {
                    model: PriceDefinition,
                    attributes: [],
                    as: "price",
                  },
                ],
                attributes: [],
              },
              {
                model: OrganizationCustomer,
                as: "organization",
                attributes: [],
              },
            ],
            as: 'order',
            attributes: []
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
            [Sequelize.literal(`timestamp`), "timestamp"],
            [Sequelize.literal(`organizationName`), "organizationName"],
          ],
        },

        group: ["History.id"],
        raw: true,
      }),
    ]);

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Статистика продаж!`
    );
    res.json({
      title: "Статистика продаж",
      orders: orders,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});
