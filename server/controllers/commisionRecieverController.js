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

exports.commisionReciever_list = asyncHandler(async (req, res, next) => {
  try {
    const allCommisionRecievers = await CommisionReciever.findAll({
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
    });

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Список получателей комиссии!`
    );
    res.json({
      title: "Список получателей комиссии",
      allCommisionRecievers: allCommisionRecievers,
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
        row.formattedDateOfOperation = row.dateOfOperation
          ? dateFns.format(row.dateOfOperation, "dd.MM.yyyy")
          : null;
      });

      if (commisionReceiver === null) {
        // No results.
        const err = new Error("Получатель комиссии не найден!");
        err.status = 404;
        return next(err);
      }
      const transaction = await sequelize.transaction();
      const query1 = `

                CREATE TEMPORARY TABLE IF NOT EXISTS first_commission_summaries (
                    orderId CHAR(36),
                    dispatchDate DATETIME,
                    billNumber VARCHAR(255),
                    titlesId CHAR(36),
                    totalCommissionPerRule DECIMAL(10, 2)
                )`;
      const query2 = `INSERT INTO first_commission_summaries (orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
                SELECT 
                    titles.orderId,
                    orders.dispatchDate,
                    orders.billNumber,
                    titles.id,
                    SUM(A.commision * titles.quantity) AS totalCommissionPerRule
                FROM 
                    AccrualRules A
            JOIN 
                TitleOrders titles ON A.productId = titles.productId
            JOIN 
                Orders orders ON titles.orderId = orders.id
            WHERE 
                orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                AND A.commisionRecieverId = :commisionRecieverId 
                AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                AND A.accessType IS NOT NULL
                AND A.generation IS NOT NULL
                AND A.accessType = titles.accessType
                AND A.generation = titles.generation
            GROUP BY 
                titles.orderId;`;

      const query3 = `CREATE TEMPORARY TABLE IF NOT EXISTS second_commission_summaries (
                    orderId CHAR(36),
                    dispatchDate DATETIME,
                    billNumber VARCHAR(255),
                    titlesId CHAR(36),
                    totalCommissionPerRule DECIMAL(10, 2)
                );`;

      const query4 = `INSERT INTO second_commission_summaries (orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
                SELECT 
                    titles.orderId,
                    orders.dispatchDate,
                    orders.billNumber,
                    titles.id,
                    SUM(A.commision * titles.quantity) AS totalCommissionPerRule
                FROM 
                    AccrualRules A
                JOIN 
                    TitleOrders titles ON A.productId = titles.productId
                JOIN 
                    Orders orders ON titles.orderId = orders.id
                WHERE 
                    orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                    AND A.commisionRecieverId = :commisionRecieverId 
                    AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                    AND (A.accessType IS NULL OR A.generation IS NULL)
                    AND (A.accessType = titles.accessType OR A.generation = titles.generation)
                    AND NOT EXISTS (
                        SELECT * FROM first_commission_summaries fcs
                        WHERE CAST(fcs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                GROUP BY 
                    titles.orderId;`;
      const query5 = `
                CREATE TEMPORARY TABLE IF NOT EXISTS third_commission_summaries (
                    orderId CHAR(36),
                    dispatchDate DATETIME,
                    billNumber VARCHAR(255),
                    titlesId CHAR(36),
                    totalCommissionPerRule DECIMAL(10, 2)
                );
                `;
      const query6 = `INSERT INTO third_commission_summaries (orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
                SELECT 
                    titles.orderId,
                    orders.dispatchDate,
                    orders.billNumber,
                    titles.id,
                    SUM(A.commision * titles.quantity) AS totalCommissionPerRule
                FROM 
                    AccrualRules A
                JOIN 
                    TitleOrders titles ON A.productId = titles.productId
                JOIN 
                    Orders orders ON titles.orderId = orders.id
                WHERE 
                    orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                    AND A.commisionRecieverId = :commisionRecieverId 
                    AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                    AND (A.accessType IS NULL AND A.generation IS NULL)
                    AND NOT EXISTS (
                        SELECT * FROM first_commission_summaries fcs
                        WHERE CAST(fcs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                    AND NOT EXISTS (
                        SELECT * FROM second_commission_summaries scs
                        WHERE CAST(scs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                GROUP BY 
                    titles.orderId;`;
      const query7 = `CREATE TEMPORARY TABLE IF NOT EXISTS fourth_commission_summaries (
                    orderId CHAR(36),
                    dispatchDate DATETIME,
                    billNumber VARCHAR(255),
                    titlesId CHAR(36),
                    totalCommissionPerRule DECIMAL(10, 2)
                )`;
      const query8 = `
                INSERT INTO fourth_commission_summaries (orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
                SELECT 
                    titles.orderId,
                    orders.dispatchDate,
                    orders.billNumber,
                    titles.id,
                    SUM(A.commision * titles.quantity) AS totalCommissionPerRule
                FROM 
                    AccrualRules A
                JOIN 
                    Products products ON A.productTypeId = products.productTypeId
                JOIN 
                    TitleOrders titles ON titles.productId = products.id
                JOIN 
                    Orders orders ON titles.orderId = orders.id
                WHERE 
                    orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                    AND A.commisionRecieverId = :commisionRecieverId 
                    AND NOT EXISTS (
                        SELECT * FROM first_commission_summaries fcs
                        WHERE CAST(fcs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                    AND NOT EXISTS (
                        SELECT * FROM second_commission_summaries scs
                        WHERE CAST(scs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                    AND NOT EXISTS (
                        SELECT * FROM third_commission_summaries tcs
                        WHERE CAST(tcs.titlesId AS CHAR(36)) = CAST(titles.id AS CHAR(36))
                    )
                GROUP BY 
                    titles.orderId;`;
      const query9 = `
                CREATE TEMPORARY TABLE IF NOT EXISTS combined_data (
                    orderId CHAR(36),
                    dispatchDate DATETIME,
                    billNumber VARCHAR(255),
                    totalCommissionPerRule DECIMAL(10, 2)
                );`;
      const query10 = `
                INSERT INTO combined_data (orderId, dispatchDate, billNumber, totalCommissionPerRule)
                SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM first_commission_summaries
                UNION ALL
                SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM second_commission_summaries
                UNION ALL
                SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM third_commission_summaries
                UNION ALL
                SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM fourth_commission_summaries;
                `;
      const query11 = `
                        SELECT 
                        DISTINCT (orderId),
                        dispatchDate,
                        billNumber,
                        totalCommissionPerRule AS 'Postyplenie'
                    FROM 
                        combined_data;
                        `;

      try {
        await sequelize
          .query(query1, { type: Sequelize.QueryTypes.RAW })
          .then(async () => {
            await sequelize
              .query(query2, {
                replacements: {
                  commisionRecieverId: req.params.commisionRecieverId,
                },
                type: Sequelize.QueryTypes.RAW,
              })
              .then(async () => {
                await sequelize
                  .query(query3, { type: Sequelize.QueryTypes.RAW })
                  .then(async () => {
                    await sequelize
                      .query(query4, {
                        replacements: {
                          commisionRecieverId: req.params.commisionRecieverId,
                        },
                        type: Sequelize.QueryTypes.RAW,
                      })
                      .then(async () => {
                        await sequelize
                          .query(query5, { type: Sequelize.QueryTypes.RAW })
                          .then(async () => {
                            await sequelize
                              .query(query6, {
                                replacements: {
                                  commisionRecieverId:
                                    req.params.commisionRecieverId,
                                },
                                type: Sequelize.QueryTypes.RAW,
                              })
                              .then(async () => {
                                await sequelize
                                  .query(query7, {
                                    type: Sequelize.QueryTypes.RAW,
                                  })
                                  .then(async () => {
                                    await sequelize
                                      .query(query8, {
                                        replacements: {
                                          commisionRecieverId:
                                            req.params.commisionRecieverId,
                                        },
                                        type: Sequelize.QueryTypes.RAW,
                                      })
                                      .then(async () => {
                                        await sequelize
                                          .query(query9, {
                                            type: Sequelize.QueryTypes.RAW,
                                          })
                                          .then(async () => {
                                            await sequelize
                                              .query(query10, {
                                                type: Sequelize.QueryTypes.RAW,
                                              })
                                              .then(async () => {
                                                await sequelize
                                                  .query(query11, {
                                                    type: Sequelize.QueryTypes
                                                      .SELECT,
                                                  })
                                                  .then(async (result) => {
                                                    result.forEach((row) => {
                                                      row.formattedDate =
                                                        row.dispatchDate
                                                          ? dateFns.format(
                                                              row.dispatchDate,
                                                              "dd.MM.yyyy"
                                                            )
                                                          : null;
                                                    });
                                                    const ress = result;
                                                    console.log(ress);

                                                    await transaction.commit();
                                                    res.json({
                                                      title: `Баланс получателя комиссии ${commisionReceiver.name}`,
                                                      commisionReceiver:
                                                        commisionReceiver,
                                                      operations:
                                                        commisionReceiverOperations,
                                                      allPostyplenie: result,
                                                    });
                                                  });
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      } catch (err) {
        err.ip = req.ip;
        logger.error(err);
        res.status(500).json({ message: "Ой, что - то пошло не так" });
        await transaction.rollback();
      }
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
            )}  - Получатель комиссии успешно создан!`
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
