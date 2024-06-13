const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const Order = require("../../models/order");
const TitleOrders = require("../../models/titleOrders");
const Account = require("../../models/account");
const OrganizationCustomer = require("../../models/organizationCustomer");
const Payee = require("../../models/payee");
const PriceDefinition = require("../../models/priceDefinition");
const Product = require("../../models/product");
const dateFns = require("date-fns");
const createHttpError = require("http-errors");
const sequelize = require("../../database/connection");

exports.user_active_orders_list = asyncHandler(async (req, res, next) => {
  const accountId = req.params.accountId;
  try {
    const organizationList = await getOrganizationList(accountId);

    const activeOrders = await Order.findAll({
      where: {
        accountId: accountId,
        status: {
          [Op.notIn]: ["Получен", "Отменен"],
        },
      },
      include: [
        {
          model: TitleOrders,
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
        {
          model: OrganizationCustomer,
          as: "organization",
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
          [Sequelize.literal(`organizationName`), "organizationName"],
          [
            sequelize.fn("count", sequelize.col("TitleOrder.id")),
            "titlesCount",
          ],
        ],
      },
      group: ["Order.id"],
      raw: true,
    });

    const productsInDraft = await sequelize.query(
      `
            SELECT  
                   GROUP_CONCAT(DISTINCT Products.id) AS productIds
            FROM Orders
            LEFT JOIN TitleOrders ON Orders.id = TitleOrders.orderId
            LEFT JOIN Products ON TitleOrders.productId = Products.id
            WHERE Orders.accountId = :accountId AND Orders.status = 'Черновик'
        `,
      {
        replacements: { accountId: accountId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    activeOrders.forEach((order) => {
      order.formattedDispatchDate = order.dispatchDate
        ? dateFns.format(order.dispatchDate, "dd-MM-yyyy")
        : null;
    });

    res.json({
      title: "Все активные заказы",
      productsInDraft: productsInDraft,
      orders_list: activeOrders,
      organizationList: organizationList,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении активных заказов" });
  }
});

exports.user_finished_orders_list = asyncHandler(async (req, res, next) => {
  const accountId = req.params.accountId;
  try {
    const finishedOrders = await Order.findAll({
      where: {
        accountId: accountId,
        status: {
          [Op.notIn]: ["Получен", "Отменен"],
        },
      },
      include: [
        {
          model: TitleOrders, // Добавляем модель TitleOrders
          attributes: [],
          include: [
            {
              model: PriceDefinition,
              attributes: [],
              as: "price",
            },
          ],
        },
        {
          model: OrganizationCustomer,
          attributes: [],
          as: "organization",
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
          [Sequelize.literal(`organizationName`), "organizationName"],
        ],
      },
      group: ["Order.id"], // Группируем результаты по id Order, чтобы суммирование работало корректно
      raw: true, // Возвращаем сырые данные, так как мы используем агрегатные функции
    });

    finishedOrders.forEach((order) => {
      order.formattedDispatchDate = order.dispatchDate
        ? dateFns.format(order.dispatchDate, "dd-MM-yyyy")
        : null;
    });
    res.json({
      title: "Все полученные заказы",
      orders_list: finishedOrders,
      sessionID: req.sessionID,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении завершенных заказов" });
  }
});

exports.admin_orders_list = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: {
          [Op.notIn]: ["Получен", "Черновик", "Черновик депозита", "Отменен"],
        },
      },

      include: [
        {
          model: Account,
          as: "account",
          attributes: [],
        },
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
        {
          model: OrganizationCustomer,
          as: "organization",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(
              `CONCAT(account.firstName, ' ', account.lastName)`
            ),
            "fullName",
          ],
          [
            Sequelize.literal(
              `SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`
            ),
            "SUM",
          ],
          [Sequelize.literal(`organizationName`), "organizationName"],
          [
            Sequelize.literal(
              `SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`
            ),
            "totalQuantity",
          ],
          [Sequelize.literal(`organizationList`), "organizationList"],
        ],
      },

      group: ["Order.id"], // Группируем результаты по id Order, чтобы суммирование работало корректно
      raw: true, // Возвращаем сырые данные, так как мы используем агрегатные функции
    });

    orders.forEach((order) => {
      order.formattedDispatchDate = order.dispatchDate
        ? dateFns.format(order.dispatchDate, "dd-MM-yyyy")
        : null;
    });
    res.json({
      title: "Все активные заказы пользователей",
      orders_list: orders,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении активных заказов" });
  }
});

exports.admin_archivedOrders_list = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: {
          [Op.in]: ["Получен", "Отменен"],
        },
      },

      include: [
        {
          model: Account,
          as: "account",
          attributes: ["firstName", "lastName"],
        },
        {
          model: TitleOrders, // Добавляем модель TitleOrders
          include: [
            {
              model: PriceDefinition,
              as: "price",
              attributes: ["priceAccess", "priceBooklet"],
            },
          ],
          attributes: ["quantity"],
        },
        {
          model: OrganizationCustomer,
          as: "organization",
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(
              `CONCAT(account.firstName, ' ', account.lastName)`
            ),
            "fullName",
          ],
          [
            Sequelize.literal(
              `SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`
            ),
            "SUM",
          ],
          [Sequelize.literal(`organizationName`), "organizationName"],
        ],
      },

      group: ["Order.id"], // Группируем результаты по id Order, чтобы суммирование работало корректно
      raw: true, // Возвращаем сырые данные, так как мы используем агрегатные функции
    });

    orders.forEach((order) => {
      order.formattedDispatchDate = order.dispatchDate
        ? dateFns.format(order.dispatchDate, "dd-MM-yyyy")
        : null;
    });
    res.json({
      title: "Архивные заказы (Получен, Отменен)",
      orders_list: orders,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Произошла ошибка при получении архивных заказов" });
  }
});

exports.user_order_detail = asyncHandler(async (req, res, next) => {
  try {
    const [draftOrder, draftTitles] = await Promise.all([
      await Order.findByPk(req.params.orderId),
      await TitleOrders.findAll({ where: { orderId: req.params.orderId } }),
    ]);
    if (draftOrder === null) {
      // No results.
      const err = new Error("Заказ не найден");
      err.status = 404;
      throw err;
    }
    if (draftOrder.status === "Черновик") {
      if (draftTitles.length > 0) {
        for (const title of draftTitles) {
          const actualActivationDate = await sequelize.query(
            `SELECT MAX(activationDate) FROM PriceDefinitions WHERE productId = :productId AND activationDate < NOW()`,
            {
              replacements: { productId: title.productId },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          const actualDate = actualActivationDate[0]["MAX(activationDate)"];
          const priceDef = await PriceDefinition.findOne({
            where: { activationDate: actualDate },
          });
          title.priceDefId = priceDef.id;
          await title.save();
        }
      }
    }

    const [order, titles, products] = await Promise.all([
      Order.findByPk(req.params.orderId, {
        include: [
          {
            model: TitleOrders,
            include: [
              {
                model: PriceDefinition,
                as: "price",
                attributes: ["priceAccess", "priceBooklet"],
              },
            ],
            attributes: ["quantity"],
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
          ],
        },
      }),
      TitleOrders.findAll({
        where: {
          orderId: req.params.orderId,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["abbreviation", "name"],
          },
          {
            model: PriceDefinition,
            as: "price",
            attributes: ["priceAccess", "priceBooklet"],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(
                `CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END`
              ),
              "SumForOneTitle",
            ],
            [
              Sequelize.literal(
                `CASE WHEN addBooklet = TRUE THEN priceBooklet ELSE priceAccess END`
              ),
              "PriceForOneProduct",
            ],
          ],
        },
      }),

      await sequelize.query(
        `
                SELECT Products.*, PriceDefinitions.priceAccess, PriceDefinitions.priceBooklet, PriceDefinitions.activationDate
                FROM Products, PriceDefinitions
                WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
                (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
                AND Products.productTypeId <> 4
            `,
        { type: sequelize.QueryTypes.SELECT }
      ),
    ]);

    res.json({
      title: "Детали заказа",
      order: order,
      titles: titles,
      products: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.admin_order_detail = asyncHandler(async (req, res, next) => {
  try {
    const [order, titles, products, payees] = await Promise.all([
      Order.findByPk(req.params.orderId, {
        include: [
          {
            model: TitleOrders,
            include: [
              {
                model: PriceDefinition,
                as: "price",
                attributes: ["priceAccess", "priceBooklet"],
              },
            ],
            attributes: ["quantity"],
          },
          {
            model: OrganizationCustomer,
            as: "organization",
            attributes: ["organizationName"],
          },
          {
            model: Payee,
            as: "payee",
            attributes: ["name"],
          },
          {
            model: Account,
            as: "account",
            attributes: ["organizationList"],
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
            [Sequelize.literal(`name`), "payeeName"],
            [Sequelize.literal(`organizationName`), "organizationName"],
            [Sequelize.literal(`organizationList`), "organizationList"],
          ],
        },
      }),
      TitleOrders.findAll({
        where: {
          orderId: req.params.orderId,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["abbreviation"],
          },
          {
            model: PriceDefinition,
            as: "price",
            attributes: ["priceAccess", "priceBooklet"],
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(
                `CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END`
              ),
              "SumForOneTitle",
            ],
            [
              Sequelize.literal(
                `CASE WHEN addBooklet = TRUE THEN priceBooklet ELSE priceAccess END`
              ),
              "PriceForOneProduct",
            ],
          ],
        },
      }),
      await sequelize.query(
        `
                SELECT Products.*, PriceDefinitions.priceAccess, PriceDefinitions.priceBooklet, PriceDefinitions.activationDate
                FROM Products, PriceDefinitions
                WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
                (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
                AND Products.productTypeId <> 4
            `,
        { type: sequelize.QueryTypes.SELECT }
      ),
      Payee.findAll(),
    ]);
    if (order.id === null) {
      // No results.
      const err = new Error("Заказ не найден");
      err.status = 404;
      throw err;
    }

    res.json({
      title: "Детали заказа",
      order: order,
      titles: titles,
      products: products,
      payees: payees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.user_order_create_post = [
  body("productId").trim().isLength({ min: 1 }).escape(),
  body("generation")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("accessType")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Должно быть больше 0")
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (!req.body)
      return res.status(400).json({ message: "Заполните обязательные поля!" });

    try {
      const actualActivationDate = await sequelize.query(
        `SELECT MAX(activationDate) FROM PriceDefinitions WHERE productId = :productId AND activationDate < NOW()`,
        {
          replacements: { productId: req.body.productId },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      const actualDate = actualActivationDate[0]["MAX(activationDate)"];
      const priceDefinition = await PriceDefinition.findOne({
        where: { activationDate: actualDate },
      });

      if (priceDefinition === null) {
        res.status(400).json({ message: "У товара еще нет цены!" });
      }

      const productId = req.body.productId;
      const generation = req.body.generation;
      const accessType =
        req.body.addBooklet === true ? null : req.body.accessType;
      const addBooklet = req.body.addBooklet;
      const quantity = req.body.quantity;
      const accountId = req.params.accountId;
      const organizationName = req.body.organizationName;

      const isDepositProduct = await ifProductTypeDeposit(productId);
      if (isDepositProduct) {
        const draftOrder = await Order.findOne({
          where: {
            status: "Черновик депозита",
            accountId: accountId,
          },
          raw: true,
        });
        if (draftOrder !== null) {
          return res.status(400).json({ message: "Измените черновик депозита!" });
        }

        const organizationCustomerId = await OrganizationCustomer.findOne({
          where: { organizationName: organizationName },
        });
        const status = "Черновик депозита";

        const order = await Order.create({
          status: status,
          accountId: accountId,
          organizationCustomerId: organizationCustomerId.id,
        });

        await TitleOrders.create({
          productId: productId,
          orderId: order.id,
          accessType: accessType,
          generation: generation,
          addBooklet: addBooklet,
          quantity: quantity,
          priceDefId: priceDefinition.id,
        });
        res.status(200).json({ message: "Товар добавлен в заказ" });
      } else if (
        (await Order.findOne({
          where: { status: "Черновик", accountId: accountId },
          raw: true,
        })) === null
      ) {
        const firstOrganizationName = await getFirstOrganizationCustomerName(
          accountId
        );
        const organizationCustomerId = await OrganizationCustomer.findOne({
          where: { organizationName: firstOrganizationName },
        });
        const status = "Черновик";
        const order = await Order.create({
          status: status,
          accountId: accountId,
          organizationCustomerId: organizationCustomerId.id,
        });

        await TitleOrders.create({
          productId: productId,
          orderId: order.id,
          accessType: accessType,
          generation: generation,
          addBooklet: addBooklet,
          quantity: quantity,
          priceDefId: priceDefinition.id,
        });
        res.status(200).json({ message: "Товар добавлен в заказ!" });
      } else {
        const order = await Order.findOne({
          where: {
            status: "Черновик",
            accountId: accountId,
          },
          raw: true,
        });
        await TitleOrders.create({
          productId: productId,
          orderId: order.id,
          accessType: accessType,
          generation: generation,
          addBooklet: addBooklet,
          quantity: quantity,
          priceDefId: priceDefinition.id,
        });
        res.status(200).json({ message: "Товар успешно добавлен в заказ!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }),
];

exports.admin_order_create_get = asyncHandler(async (req, res, next) => {
  const [productsWithMaxPriceDefinitions, allOrganizations, allPayees] =
    await Promise.all([
      await sequelize.query(
        `
        SELECT Products.*, PriceDefinitions.priceAccess, PriceDefinitions.priceBooklet, PriceDefinitions.activationDate
        FROM Products, PriceDefinitions
        WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
        (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
        `,
        { type: sequelize.QueryTypes.SELECT }
      ),
      OrganizationCustomer.findAll(),
      Payee.findAll(),
    ]);

  // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
  res.json({
    title: "Форма создания заказа",
    allProducts: productsWithMaxPriceDefinitions,
    allOrganizations: allOrganizations,
    allPayees: allPayees,
  });
});

exports.admin_order_create_post = [
  body("organizationCustomerId", "Организация должна быть указана")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status", "Заказ не может быть без статуса")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("billNumber").optional({ checkFalsy: true }).trim().escape(),
  body("payeeId").optional({ checkFalsy: true }).trim().escape(),
  body("isFromDeposit").escape(),
  body("titlesToCreate.*.productId")
    .if(body("productId").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("titlesToCreate.*.accessType")
    .if(body("accessType").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("titlesToCreate.*.generation")
    .if(body("generation").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("titlesToCreate.*.quantity")
    .if(body("quantity").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("titlesToCreate.*.addBooklet").if(body("addBooklet").exists()).escape(),
  body().custom((value, { req }) => {
    const titlesToCreate = req.body.titlesToCreate;
    for (const title of titlesToCreate) {
      if (title.addBooklet === true && title.accessType !== null) {
        res
          .status(400)
          .json({
            message: "Буклет представлен только в виде бумажного формата!",
          });
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const titlesToCreate = req.body.titlesToCreate;
      const order = new Order({
        organizationCustomerId: req.body.organizationCustomerId,
        dispatchDate: req.body.status === "Отправлен" ? new Date() : null,
        status: req.body.status,
        billNumber: req.body.billNumber,
        payeeId: req.body.payeeId,
        isFromDeposit: req.body.isFromDeposit,
      });

      if (!errors.isEmpty()) {
        const [allPayees, allOrganizations, allProducts] = await Promise.all([
          Payee.findAll(),
          OrganizationCustomer.findAll(),
          Product.findAll(),
        ]);

        res.json({
          title: "Некорректная форма создания заказа!",
          order: order,
          allProducts: allProducts,
          allPayees: allPayees,
          allOrganizations: allOrganizations,
          errors: errors.array(),
        });
      } else {
        await order.save();
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
            where: { activationDate: actualDate },
          });

          title.orderId = order.id;
          title.priceDefId = priceDefinition.id;

          await TitleOrders.create({
            productId: title.productId,
            orderId: title.orderId,
            accessType: title.accessType,
            generation: title.generation,
            addBooklet: title.addBooklet,
            quantity: title.quantity,
            priceDefId: title.priceDefId,
          });
        }
        res.status(200).json({ message: "Заказ успешно создан!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }),
];

exports.user_draftOrder_updateStatus_put = [
  // Validate and sanitize fields.

  body("organizationName").if(body("organizationName").exists()).escape(),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const organizationName = req.body.organizationName;
      const organizationCustomerId = await OrganizationCustomer.findOne({
        where: { organizationName: organizationName },
      });
      const order = new Order({
        organizationCustomerId: organizationCustomerId.id,
        _id: req.params.orderId,
      });

      if (!errors.isEmpty()) {
        const [allOrganizations] = await Promise.all([
          getOrganizationList(req.params.accountId),
        ]);

        res.json({
          title: "Некорректное обновление",
          allOrganizations: allOrganizations,
          order: order,
          errors: errors.array(),
        });
      } else {
        const oldOrder = await Order.findByPk(req.params.orderId);
        const titles = await TitleOrders.findAll({
          where: { orderId: oldOrder.id },
        });
        if (
          oldOrder.status !== "Черновик" &&
          oldOrder.status !== "Черновик депозита"
        ) {
          res
            .status(400)
            .json({ message: "Редактировать можно только черновик!" });
        }
        if (titles.length === 0) {
          res.status(400).json({ message: "Добавьте товары в заказ!" });
        }
        oldOrder.organizationCustomerId = order.organizationCustomerId;
        oldOrder.status = "Активный";
        await oldOrder.save();
        res
          .status(200)
          .json({ message: 'Заказ успешно переведён в статус "Активный"!' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }),
];

exports.user_receivedOrder_updateStatus_put = [
  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.json({
          title: "Update order",
          errors: errors.array(),
        });
        return;
      } else {
        const oldOrder = await Order.findByPk(req.params.orderId);
        if (oldOrder.status !== "Отправлен") {
          res.status(400).json({ message: "Этот заказ еще не отправлен!" });
        }
        oldOrder.status = "Получен";
        await oldOrder.save();
        res
          .status(200)
          .json({ message: 'Заказ успешно переведён в статус "Получен"!' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }),
];

async function getOrganizationList(accountId) {
  try {
    const account = await Account.findByPk(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account.organizationList;
  } catch (error) {
    console.error(error);
    throw new Error("Account not found");
  }
}

async function getFirstOrganizationCustomerName(accountId) {
  try {
    const account = await Account.findOne({
      where: {
        id: accountId,
      },
    });
    if (account.id !== null) {
      const organizationsList = account.organizationList;
      const firstOrganization = organizationsList[0];
      return firstOrganization;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching org list:", error);
    throw new Error("Error fetching org list");
  }
}

async function ifProductTypeDeposit(productId) {
  const product = await Product.findByPk(productId);
  const productTypeId = parseInt(product.productTypeId, 10);
  if (productTypeId === 4) {
    return true;
  } else return false;
}
