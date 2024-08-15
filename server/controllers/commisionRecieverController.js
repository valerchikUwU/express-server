const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const CommisionReciever = require("../../models/commisionReceiver");
const AccrualRule = require("../../models/accrualRule");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const PriceDefinition = require("../../models/priceDefinition");
const Product = require("../../models/product");
const ProductType = require("../../models/productType");
const sequelize = require("../../database/connection");
const CommisionRecieverOperations = require("../../models/commisionRecieverOperations");
const dateFns = require("date-fns");
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

exports.commisionReciever_list = asyncHandler(async (req, res, next) => {
  try {
    const [allCommisionRecievers, commisionReceiverOperations] = await Promise.all([
      CommisionReciever.findAll({
        include: [
          {
            model: AccrualRule,
            as: "rules",
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [Sequelize.fn("COUNT", Sequelize.col("rules.id")), "rulesQuantity"],
          ],
        },

        group: ["CommisionReciever.id"],
      }),
      CommisionRecieverOperations.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                `SUM(Spisanie)`
              ),
              "allSpisanie",
            ],
            [
              Sequelize.literal(
                `SUM(Postyplenie)`
              ),
              "allPostyplenie",
            ]
          ],
        },
        group: ['commisionRecieverId'],
      })
    ])


    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Список получателей комиссии!`
    );
    res.json({
      title: "Список получателей комиссии",
      allCommisionRecievers: allCommisionRecievers,
      commisionReceiverOperations: commisionReceiverOperations
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }



});

exports.commisionReciever_rules_details = asyncHandler(
  async (req, res, next) => {
    try {
      const [commisionReciever, allRules, allProducts] = await Promise.all([
        CommisionReciever.findByPk(req.params.commisionRecieverId),
        AccrualRule.findAll({
          where: {
            commisionRecieverId: req.params.commisionRecieverId,
          },
          include: [
            {
              model: Product,
              as: "product",
              attributes: [],
            },
          ],
          attributes: {
            include: [
              [Sequelize.literal(`product.name`), "prodName"],
              [Sequelize.literal(`product.abbreviation`), "prodAbbreviation"],
            ],
          },
        }),
        await sequelize.query(
          `
                SELECT Products.*, PriceDefinitions.activationDate
                FROM Products, PriceDefinitions
                WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
                (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
                AND Products.productTypeId <> 4
            `,
          { type: sequelize.QueryTypes.SELECT }
        ),
      ]);

      if (commisionReciever === null) {
        const err = new Error("Такой получатель комиссии не найден!");
        err.status = 404;
        return next(err);
      }

      res.json({
        title: `Правила начисления получателя комиссии ${commisionReciever.name}`,
        commisionReciever: commisionReciever,
        allRules: allRules,
        allProducts: allProducts,
      });
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);

      if (err.status === 404) {
        res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }
);

exports.commisionReciever_balance_details = asyncHandler(
  async (req, res, next) => {
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
  }
);

exports.commisionReciever_create_post = [
  body("commisionRecieverName", "Имя получателя комиссии должно быть указано!")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const commisionReciever = new CommisionReciever({
        name: req.body.commisionRecieverName,
      });

      if (!errors.isEmpty()) {
        res.json({
          title: "Некорректная форма создания получателя",
          commisionReciever: commisionReciever,
          errors: errors.array(),
        });
      } else {
        await commisionReciever.save();
        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(
            req.ip
          )} - CommisionReciever PROPS: ${JSON.stringify(commisionReciever)}  - Получатель комиссии успешно создан!`
        );
        res.status(200).send("Получатель комиссии успешно создан!");
      }
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);

      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }),
];
