const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const OrganizationCustomer = require("../../models/organizationCustomer");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const Product = require("../../models/product");
const PriceDefinition = require("../../models/priceDefinition");
const dateFns = require("date-fns");
const { logger } = require("../../configuration/loggerConf")
const History = require("../../models/history.js");
const chalk = require("chalk");


exports.deposits_list = asyncHandler(async (req, res, next) => {
  try {
    const organizations = await OrganizationCustomer.findAll({
      include: [
        {
          model: History,
          where: {
            orderStatus: 'Оплачен'
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
                    {
                      model: Product,
                      attributes: [],
                      as: "product",
                    },
                  ],
                  attributes: [],
                },
              ],
              attributes: [],
              as: "order",
            },
          ],
          attributes: [],
          as: "histories",   
          required:false
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SUM(CASE WHEN  addBooklet = TRUE AND isFromDeposit = TRUE THEN quantity * priceBooklet WHEN addBooklet = FALSE AND isFromDeposit = TRUE THEN quantity * priceAccess WHEN productTypeId = 4 AND createdBySupAdm = TRUE AND quantity < 0 THEN (quantity * -1) END))`
            ),
            "SUM",
          ],
          [
            Sequelize.literal(
              `SUM(CASE WHEN productTypeId = 4 AND quantity > 0 THEN (quantity*1) END)`
            ),
            "allDeposits",
          ]
        ],
      },
      group: ["OrganizationCustomer.id"],
      raw: true,
    });
    organizations.forEach((org) => {
      org.SUM = org.SUM ? Number(org.SUM)*1 : 0;
      org.allDeposits = org.allDeposits ? Number(org.allDeposits)*1 : 0
    });
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Список депозитов организаций!`
    );
    res.json({
      title: "Список депозитов организаций",
      organizations: organizations,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.deposits_details = asyncHandler(async (req, res, next) => {
  try {
    const [organization, unfilteredOrders] = await Promise.all([
      await OrganizationCustomer.findByPk(req.params.organizationCustomerId),
      History.findAll({
        where: {
          organizationCustomerId: req.params.organizationCustomerId,
          orderStatus: 
            'Оплачен'
          
        },

        include: [
          {
            model: Order,
            include:
            [
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
                    attributes: [],
                    as: "product",
                  },
                ],
                attributes: [],
              },
            ],
            as: 'order',
            attributes: []
          }
         
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(
                `(SUM(CASE WHEN  addBooklet = TRUE AND isFromDeposit = TRUE THEN quantity * priceBooklet WHEN addBooklet = FALSE AND isFromDeposit = TRUE THEN quantity * priceAccess WHEN productTypeId = 4 AND createdBySupAdm = TRUE AND quantity < 0 THEN (quantity * -1) END))*-1`
              ),
              "Spisanie",
            ],

            [
              Sequelize.literal(
                `CASE WHEN productTypeId = 4 AND quantity > 0 THEN (quantity*1) END`
              ),
              "Deposit",
            ],
          ],
        },

        group: ["History.id"],
        raw: true,
      }),
    ]);

    if (organization === null) {
      // No results.
      const err = new Error("Такая организация не найдена");
      err.status = 404;
      return next(err);
    }

    const orders = unfilteredOrders.filter(order => 
      (order.Deposit !== null || order.Spisanie !== null)
    );
    orders.forEach((order) => {
      order.formattedDispatchDate = order.timestamp
        ? dateFns.format(order.timestamp, "dd.MM.yyyy")
        : null;
    });

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - История депозитов организации ${organization.organizationName}`
    );
    res.json({
      title: `История депозитов организации ${organization.organizationName}`,
      organization: organization,
      orders: orders,
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

exports.deposit_create_post = [
  body("billNumber").escape(),
  body("deposit").optional({ checkFalsy: true }).escape(),
  body("withdraw").optional({ checkFalsy: true }).escape(),
  body().custom((value, { req }) => {
    if (!req.body.withdraw && !req.body.deposit) {
      const err = new Error("At least one of deposit or withdraw must be provided.");
      err.status = 400;
      err.ip = req.ip;
      logger.error(err);
    }
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    try {
      const organizationCustomer = await OrganizationCustomer.findByPk(req.params.organizationCustomerId);
      const order = new Order({
        organizationCustomerId: organizationCustomer.id,
        status: "Выставлен счёт",
        dispatchDate: new Date(),
        billNumber: req.body.billNumber,
        accountId: req.params.accountId,
        createdBySupAdm: true,
      });
      const deposit = await Product.findOne({ where: { productTypeId: 4 } });
      const priceDef = await PriceDefinition.findOne({
        where: { productId: deposit.id },
      });

      if (!errors.isEmpty()) {
        

        res.json({
          title: "Создание депозита",
          order: order,
          errors: errors.array(),
        });
      } else {
        await order.save();
        await History.create({
          accountId: req.params.accountId,
          orderId: order.id,
          timestamp: new Date(),
          orderStatus: order.status,
          billNumber: order.billNumber,
          organizationCustomerId: organizationCustomer.id,
        });
        await TitleOrders.create({
          productId: deposit.id,
          orderId: order.id,
          quantity:
            req.body.deposit === null
              ? req.body.withdraw * -1
              : req.body.deposit,
          priceDefId: priceDef.id,
        });
        
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Депозит успешно создан!`
    );
        res.status(200).json({message: "Депозит успешно создан!"});
      }
    } catch (err) {

      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }),
];
