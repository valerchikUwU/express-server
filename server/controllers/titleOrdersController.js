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
const chalk = require("chalk");

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
      if (title.addBooklet === false && title.accessType === undefined) {
        const err = new Error("Выберите тип доступа!");
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
        return res.status(400).json({ error: err.message });
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const order = await Order.findByPk(req.params.orderId);
      if (order.status !== "Черновик") {
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
                where: { activationDate: actualDate },
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
          )}  - Наименования успешно обновлены!`
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
  body().custom((value, { req }) => {
    const titlesToUpdate = req.body.titlesToUpdate;
    const titlesToCreate = req.body.titlesToCreate;
    for (const title of titlesToCreate) {
      if (title.addBooklet === 1 && title.accessType !== null) {
        const err = new Error(
          "Буклет представлен только в виде бумажного формата!"
        );
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
        return res.status(400).json({ message: err.message });
      }
    }
    for (const title of titlesToUpdate) {
      if (title.addBooklet === 1 && title.accessType !== null) {
        const err = new Error(
          "Буклет представлен только в виде бумажного формата!"
        );
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
        return res.status(400).json({ message: err.message });
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
        loggers.error(errors.array());
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
        } else {
          
        const history = new History({
          accountId: req.params.accountId,
          orderId: req.params.orderId,
          timestamp: new Date(),
          billNumber: oldOrder.billNumber,
        });
          if (oldOrder.status !== order.status) {
            oldOrder.dispatchDate = new Date();
            history.orderStatus = order.status;
          }
          oldOrder.status = order.status;
          await history.save();
          await oldOrder.save();
          logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Статус успешно изменен!`
          );
          return res.status(200).json({ message: "Статус успешно изменен!" });
        }
        oldOrder.organizationCustomerId = order.organizationCustomerId;
        if (oldOrder.status !== order.status) {
          oldOrder.dispatchDate = new Date();
        }
        oldOrder.status = order.status;
        oldOrder.billNumber = order.billNumber;
        oldOrder.payeeId = order.payeeId;
        oldOrder.isFromDeposit = order.isFromDeposit;

        await oldOrder.save();

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Наименования успешно обновлены!`
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
