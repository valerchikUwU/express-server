const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, and, Op, fn, col } = require("sequelize");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const PriceDefinition = require("../../models/priceDefinition");
const OrganizationCustomer = require("../../models/organizationCustomer");
const sequelize = require("../../database/connection");
const { webPush } = require("../../utils/webPush");
const { logger } = require("../../configuration/loggerConf");
const History = require("../../models/history.js")
const chalk = require("chalk");
const AccrualRule = require("../../models/accrualRule.js");
const CommisionRecieverOperations = require("../../models/commisionRecieverOperations.js");
const { access } = require("fs");
const Product = require("../../models/product.js");

exports.user_titleOrder_update_put = [
  // Validate and sanitize fields.
  body("titlesToUpdate.*.productId")
    .if(body("productId").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("titlesToUpdate.*.accessType")
    .if(body("accessType").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("titlesToUpdate.*.generation")
    .if(body("generation").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("titlesToUpdate.*.quantity")
    .if(body("quantity").exists())
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body("titlesToUpdate.*.addBooklet").if(body("addBooklet").exists()).escape(),
  body().custom((value, { req }) => {
    const titlesToUpdate = req.body.titlesToUpdate;
    for (const title of titlesToUpdate) {
      // Проверяем, что если addBooklet равен 1, то accessType не может быть ни 'Бумажный', ни 'Электронный'
      if (title.addBooklet === "true" && title.accessType !== null) {
        const err = new Error("Буклет представлен только в виде бумажного формата!");
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const order = await Order.findByPk(req.params.orderId);
      if (order.status !== "Черновик" && order.status !== "Черновик депозита") {
        const err = new Error("Редактировать можно только черновик!");
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
        return res.status(400).json({ error: err.message });
      }
      const titlesToUpdate = req.body.titlesToUpdate;
      if (!errors.isEmpty()) {
        const [order, titleOrders] = await Promise.all([
          Order.findByPk(req.params.orderId),
          TitleOrders.findAll({ where: { orderId: req.params.orderId } }),
        ]);
        logger.error(errors.array());
        res.json({
          title: "Некорректное обновление наименований в заказе",
          titleOrders: titleOrders,
          order: order,
          errors: errors.array(),
        });
        return;
      } else {
        for (const title of titlesToUpdate) {
          const oldTitle = await TitleOrders.findByPk(title.id);
          if (oldTitle) {
            // Проверяем, были ли предоставлены новые значения для полей

            if (title.accessType) {
              oldTitle.accessType = title.accessType;
            }

            if (title.productId) {
              oldTitle.productId = title.productId;
              const actualActivationDate = await sequelize.query(
                `SELECT MAX(activationDate) FROM PriceDefinitions WHERE productId = :productId`,
                {
                  replacements: { productId: title.productId },
                  type: sequelize.QueryTypes.SELECT,
                }
              );
              const actualDate = actualActivationDate[0]["MAX(activationDate)"];
              const priceDef = await PriceDefinition.findOne({
                where: { activationDate: actualDate, productId: title.productId },
              });
              oldTitle.priceDefId = priceDef.id;
            }

            if (title.generation) {
              oldTitle.generation = title.generation;
            }

            if (title.quantity) {
              oldTitle.quantity = title.quantity;
            }
            if (title.addBooklet === true) {
              oldTitle.addBooklet = title.addBooklet;
              oldTitle.accessType = null;
            } else {
              oldTitle.addBooklet = title.addBooklet;
            }
            await oldTitle.save();
          }
        }

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(
            req.ip
          )} Titles PROPS: ${JSON.stringify(titlesToUpdate)}   - Наименования успешно обновлены!`
        );
        res.status(200).json({ message: "Наименования успешно обновлены!" });
      }
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }),
];

exports.title_delete = asyncHandler(async (req, res, next) => {
  try {
    const title = await TitleOrders.findByPk(req.params.titleId);

    if (title === null) {
      const err = new Error("Наименование не найдено!");
      err.status = 400;
      err.ip = req.ip;
      logger.error(err);
      return res.status(400).json({ error: err.message });
    }

    await TitleOrders.destroy({ where: { id: req.params.titleId } });
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Наименование успешно удалено!`
    );
    res.status(200).send("Наименование успешно удалено!");
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});

exports.admin_titleOrder_update_put = [
  // Validate and sanitize fields.
  body("organizationName", "organizationName must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "status must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("dispatchDate")
    .optional({ checkFalsy: true })
    .escape(),
  body("billNumber").optional({ checkFalsy: true }).escape(),
  body("payeeId").optional({ checkFalsy: true }).escape(),
  body("titlesToUpdate.*.productId")
    .if(body("productId").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("titlesToUpdate.*.accessType")
    .optional({ nullable: true })
    .if(body("accessType").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("titlesToUpdate.*.generation")
    .optional({ nullable: true })
    .if(body("generation").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("titlesToUpdate.*.quantity")
    .if(body("quantity").exists())
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body("titlesToUpdate.*.addBooklet").if(body("addBooklet").exists()).escape(),
  body("titlesToCreate.*.productId")
    .if(body("productId").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("titlesToCreate.*.accessType")
    .optional({ nullable: true })
    .if(body("accessType").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("titlesToCreate.*.generation")
    .optional({ nullable: true })
    .if(body("generation").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("titlesToCreate.*.quantity")
    .if(body("quantity").exists())
    .trim()
    .isInt({ min: 1 })
    .escape(),
  body("titlesToCreate.*.addBooklet").if(body("addBooklet").exists()).escape(),
  body().custom(async (value, { req }) => {
    const titlesToUpdate = req.body.titlesToUpdate;
    const titlesToCreate = req.body.titlesToCreate;
    const deposit = await Product.findOne({ where: { productTypeId: 4 } })
    for (const title of titlesToCreate) {
      if (title.productId !== deposit.id) {
        if ((title.addBooklet === "true" && title.accessType !== null) || (title.addBooklet === "false" && title.accessType === null)) {
          const err = new Error(
            "Выберите тип доступа или уберите доп. буклет"
          );
          err.status = 400;
          err.ip = req.ip;
          logger.error(err);
          throw err;
        }
      }
    }

    for (const title of titlesToUpdate) {

      if (title.productId !== deposit.id) {

        if ((title.addBooklet === true && title.accessType !== null) || (title.addBooklet === false && title.accessType === null)) {
          const err = new Error(
            "Выберите тип доступа или уберите доп.буклет"
          );
          err.status = 400;
          err.ip = req.ip;
          logger.error(err);
          throw err;
        }
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);


      const titlesToUpdate = req.body.titlesToUpdate;
      const titlesToCreate = req.body.titlesToCreate;
      const organizationCustomer = await OrganizationCustomer.findOne({
        where: { organizationName: req.body.organizationName },
      });

      const order = new Order({
        organizationCustomerId: organizationCustomer.id,
        status: req.body.status,
        billNumber: req.body.billNumber,
        payeeId: req.body.payeeId,
        isFromDeposit: req.body.isFromDeposit,
        _id: req.params.orderId,
      });

      if (!errors.isEmpty()) {
        const [order, titleOrders] = await Promise.all([
          Order.findByPk(req.params.orderId),
          TitleOrders.findAll({ where: { orderId: req.params.orderId } }),
        ]);
        logger.error(errors.array());
        res.json({
          title: "Некорректная форма обновления!",
          titleOrders: titleOrders,
          order: order,
          errors: errors.array(),
        });
        return;
      } else {

        const oldOrder = await Order.findByPk(req.params.orderId);
        if (order.status !== null && oldOrder.status !== order.status) {
          webPush(
            oldOrder.accountId,
            oldOrder.orderNumber,
            oldOrder.status,
            order.status
          );
        }
        if (oldOrder.status !== "Оплачен" && oldOrder.status !== "Отправлен") {
          for (const title of titlesToUpdate) {
            const oldTitle = await TitleOrders.findByPk(title.id);
            if (oldTitle) {
              // Проверяем, были ли предоставлены новые значения для полей

              if (title.accessType) {
                oldTitle.accessType = title.accessType;
              }

              if (title.productId) {
                oldTitle.productId = title.productId;
                const actualActivationDate = await sequelize.query(
                  `SELECT MAX(activationDate) FROM PriceDefinitions WHERE productId = :productId`,
                  {
                    replacements: { productId: title.productId },
                    type: sequelize.QueryTypes.SELECT,
                  }
                );
                const actualDate =
                  actualActivationDate[0]["MAX(activationDate)"];
                const priceDef = await PriceDefinition.findOne({
                  where: {
                    activationDate: actualDate,
                    productId: title.productId,
                  },
                });
                oldTitle.priceDefId = priceDef.id;
              }

              if (title.generation) {
                oldTitle.generation = title.generation;
              }

              if (title.quantity) {
                oldTitle.quantity = title.quantity;
              }
              if (title.addBooklet === true) {
                oldTitle.addBooklet = title.addBooklet;
                oldTitle.accessType = null;
              } else {
                oldTitle.addBooklet = title.addBooklet;
              }
              await oldTitle.save();
            }
          }
          if (titlesToCreate.length > 0) {
            for (const title of titlesToCreate) {
              const actualActivationDate = await sequelize.query(
                `SELECT MAX(activationDate) FROM PriceDefinitions WHERE productId = :productId AND activationDate < NOW()`,
                {
                  replacements: { productId: title.productId },
                  type: sequelize.QueryTypes.SELECT,
                }
              );
              const actualDate = actualActivationDate[0]["MAX(activationDate)"];
              const priceDefinition = await PriceDefinition.findOne({
                where: {
                  activationDate: actualDate,
                  productId: title.productId,
                },
              });
              if (priceDefinition === null) {
                const err = new Error("У товара еще нет цены!");
                err.status = 400;
                err.ip = req.ip;
                logger.error(err);
                return res.status(400).json({ message: err.message });
              }

              await TitleOrders.create({
                productId: title.productId,
                orderId: oldOrder.id,
                accessType: title.accessType,
                generation: title.generation,
                addBooklet: title.addBooklet,
                quantity: title.quantity,
                priceDefId: priceDefinition.id,
              });
            }
          }
          if (order.status === "Оплачен") {
            const titleOrders = await TitleOrders.findAll({ where: { orderId: oldOrder.id } });

            const productIds = titleOrders.map(titleOrder => titleOrder.productId);


            const accrualRulesFirst = await AccrualRule.findAll({
              where: {
                productId: {
                  [Op.in]: productIds
                },
                [Op.and]: [
                  { accessType: { [Op.ne]: null } }, // Не равно null
                  { generation: { [Op.ne]: null } }   // Не равно null
                ]
              }
            });

            logger.info(
              `${chalk.yellow("AC1!")} - ${chalk.red(req.ip)} - AC2 PROPS: ${JSON.stringify(accrualRulesFirst)}`
            );

            const accrualRulesSecond = await AccrualRule.findAll({
              where: {
                productId: {
                  [Op.in]: productIds
                },
                [Op.or]: [
                  {
                    [Op.and]: [
                      { accessType: { [Op.eq]: null } }, // Равно null
                      { generation: { [Op.ne]: null } }   // Не равно null
                    ]
                  },
                  {
                    [Op.and]: [
                      { accessType: { [Op.ne]: null } }, // Не равно null
                      { generation: { [Op.eq]: null } }   // Равно null
                    ]
                  }
                ]
              }
            });


            logger.info(
              `${chalk.yellow("AC2!")} - ${chalk.red(req.ip)} - AC2 PROPS: ${JSON.stringify(accrualRulesSecond)}`
            );
            const accrualRulesThird = await AccrualRule.findAll({
              where: {
                productId: {
                  [Op.in]: productIds
                },
                [Op.and]: [
                  { accessType: { [Op.eq]: null } },
                  { generation: { [Op.eq]: null } }
                ]
              }
            });
            logger.info(
              `${chalk.yellow("AC3!")} - ${chalk.red(req.ip)} - AC3 PROPS: ${JSON.stringify(accrualRulesThird)}`
            );
            const accrualRulesFourth = await AccrualRule.findAll({
              where: {
                productId: {
                  [Op.eq]: null
                }
              }
            })
            logger.info(
              `${chalk.yellow("AC4!")} - ${chalk.red(req.ip)} - AC4 PROPS: ${JSON.stringify(accrualRulesFourth)}`
            );

            let operationBillNumber = oldOrder.billNumber;
            if (order.billNumber !== null) {
              operationBillNumber = order.billNumber
            }

            for (const title of titleOrders) {
              let flag = false;
              for (const rule of accrualRulesFirst) {
                if (title.productId === rule.productId && title.accessType === rule.accessType && title.generation === rule.generation) {
                  const decimalCommision = Number(rule.commision) * title.quantity;
                  const operation = await CommisionRecieverOperations.create({
                    billNumber: operationBillNumber,
                    Postyplenie: decimalCommision,
                    dateOfOperation: new Date(),
                    commisionRecieverId: rule.commisionRecieverId,
                    Spisanie: null
                  });
                  flag = true;
                }
              }

              if (flag === true) continue;

              for (const rule of accrualRulesSecond) {
                console.log(`AC2 ${JSON.stringify(rule)}`);
                if (title.productId === rule.productId && (title.accessType === rule.accessType || title.generation === rule.generation)) {
                  const decimalCommision = Number(rule.commision) * title.quantity;
                  const operation = await CommisionRecieverOperations.create({
                    billNumber: operationBillNumber,
                    Postyplenie: decimalCommision,
                    dateOfOperation: new Date(),
                    commisionRecieverId: rule.commisionRecieverId,
                    Spisanie: null
                  });
                  flag = true;
                }
              }
              if (flag === true) continue;


              for (const rule of accrualRulesThird) {
                if (title.productId === rule.productId) {
                  const decimalCommision = Number(rule.commision) * title.quantity;
                  const operation = await CommisionRecieverOperations.create({
                    billNumber: operationBillNumber,
                    Postyplenie: decimalCommision,
                    dateOfOperation: new Date(),
                    commisionRecieverId: rule.commisionRecieverId,
                    Spisanie: null
                  });
                  flag = true;
                }
              }
              if (flag === true) continue;

              for (const rule of accrualRulesFourth) {
                console.log(`AC4 ${JSON.stringify(rule)}`);
                const product = await Product.findByPk(title.productId)
                if (product.productTypeId === rule.productTypeId) {
                  const decimalCommision = Number(rule.commision) * title.quantity;
                  const operation = await CommisionRecieverOperations.create({
                    billNumber: operationBillNumber,
                    Postyplenie: decimalCommision,
                    dateOfOperation: new Date(),
                    commisionRecieverId: rule.commisionRecieverId,
                    Spisanie: null
                  });
                }
              }
            }
          }
        } else {
          if (oldOrder.status !== order.status) {
            oldOrder.dispatchDate = req.body.dispatchDate ?? new Date();
            const history = new History({
              accountId: req.params.accountId,
              orderId: req.params.orderId,
              timestamp: new Date(),
              billNumber: oldOrder.billNumber,
              organizationCustomerId: oldOrder.organizationCustomerId,
              orderStatus: order.status
            });
            await history.save();
            console.log(`${chalk.cyan('added to history Статус успешно изменен!')}`)
          }
          oldOrder.status = order.status;
          await oldOrder.save();
          logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)} - Order PROPS: ${JSON.stringify(order)}  - TitlesToCreate PROPS: ${JSON.stringify(titlesToCreate)}  - TitlesToUpdate PROPS: ${JSON.stringify(titlesToUpdate)}   - Статус успешно изменен!`
          );
          return res.status(200).json({ message: "Статус успешно изменен!" });
        }
        oldOrder.organizationCustomerId = order.organizationCustomerId;
        if (oldOrder.status !== order.status) {
          oldOrder.dispatchDate = req.body.dispatchDate ?? new Date();
          const history = new History({
            accountId: req.params.accountId,
            orderId: req.params.orderId,
            timestamp: new Date(),
            billNumber: oldOrder.billNumber,
            organizationCustomerId: oldOrder.organizationCustomerId,
            orderStatus: order.status
          });
          console.log(`${chalk.cyan('added to history Наименования успешно обновлены!')}`)
          await history.save();
        }
        oldOrder.status = order.status;
        oldOrder.billNumber = order.billNumber;
        oldOrder.payeeId = order.payeeId;
        oldOrder.isFromDeposit = order.isFromDeposit;
        await oldOrder.save();

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(req.ip)} - Order PROPS: ${JSON.stringify(order)}  - TitlesToCreate PROPS: ${JSON.stringify(titlesToCreate)}  - TitlesToUpdate PROPS: ${JSON.stringify(titlesToUpdate)}  - Наименования успешно обновлены!`
        );
        res.status(200).json({ message: "Наименования успешно обновлены!" });
      }
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }),
];
