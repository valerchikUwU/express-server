const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const ProductType = require("../../models/productType");
const Product = require("../../models/product");
const OrganizationCustomer = require("../../models/organizationCustomer");
const Account = require("../../models/account");
const Order = require("../../models/order");
const PriceDefinition = require("../../models/priceDefinition");
const TitleOrders = require("../../models/titleOrders");
const sequelize = require("../../database/connection");
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

exports.all_products = asyncHandler(async (req, res, next) => {
  try {
    const allProduct = Product.findAll();

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Все продукты!`
    );
    res.json({
      title: "Все продукты",
      allProduct: allProduct,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});

exports.products_list = asyncHandler(async (req, res, next) => {
  const productTypeId = parseInt(req.params.typeId, 10);
  try {
    if (isNaN(productTypeId)) {
      const err = new Error("Неверный тип товара!");
      err.status = 400;
      err.ip = req.ip;
      logger.error(err);
      return res.status(400).json({ error: err.message });
    }

    switch (productTypeId) {
      case 1:
        const productsInit = await sequelize.query(
          `
      SELECT DISTINCT Products.*, images.path
        FROM Products
        JOIN PriceDefinitions ON PriceDefinitions.productId = Products.id
        JOIN Images images ON images.id = Products.imageId 
        WHERE PriceDefinitions.activationDate = (
            SELECT MAX(activationDate) 
            FROM PriceDefinitions 
            WHERE PriceDefinitions.productId = Products.id 
            AND activationDate < NOW()
        )
        AND Products.productTypeId = 1;

      `,
          { type: sequelize.QueryTypes.SELECT }
        );

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Начальные"!`
        );
        res.json({
          title: "Начальные",
          productsList: productsInit,
        });
        break;
      case 2:
        const productsMain = await sequelize.query(
          `
      SELECT DISTINCT Products.*, images.path
        FROM Products
        JOIN PriceDefinitions ON PriceDefinitions.productId = Products.id
        JOIN Images images ON images.id = Products.imageId 
        WHERE PriceDefinitions.activationDate = (
            SELECT MAX(activationDate) 
            FROM PriceDefinitions 
            WHERE PriceDefinitions.productId = Products.id 
            AND activationDate < NOW()
        )
          AND Products.productTypeId = 2
      `,
          { type: sequelize.QueryTypes.SELECT }
        );

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Основные!`
        );
        res.json({
          title: "Основные",
          productsList: productsMain,
        });
        break;
      case 3:
        const productsForEmployers = await sequelize.query(
          `
      SELECT DISTINCT Products.*, images.path
        FROM Products
        JOIN PriceDefinitions ON PriceDefinitions.productId = Products.id
        JOIN Images images ON images.id = Products.imageId 
        WHERE PriceDefinitions.activationDate = (
            SELECT MAX(activationDate) 
            FROM PriceDefinitions 
            WHERE PriceDefinitions.productId = Products.id 
            AND activationDate < NOW()
        )
          AND Products.productTypeId = 3
      `,
          { type: sequelize.QueryTypes.SELECT }
        );

        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Для персонала!`
        );
        res.json({
          title: "Для персонала",
          productsList: productsForEmployers,
        });
        break;
      case 4:
        const organizationsList = await getOrganizationList(
          req.params.accountId
        );
        console.log(organizationsList)
        const [productsDeposit, organizations] = await Promise.all([
          await Product.findAll({
            where: { productTypeId: productTypeId },
            raw: true,
          }),
          await OrganizationCustomer.findAll({
            where: {
              organizationName: {
                [Op.in]: organizationsList,
              },
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
                as: "orders",
              },
            ],
            attributes: {
              include: [
                [
                  Sequelize.literal(
                    `(SUM(CASE WHEN productTypeId = 4 AND (status = 'Выставлен счёт' OR status = 'Отправлен' OR status = 'Получен') THEN (quantity*1) END)) - (CASE WHEN status = 'Активный' OR status = 'Отправлен' OR status = 'Получен' THEN (SUM(CASE WHEN productTypeId <> 4 AND addBooklet = TRUE AND isFromDeposit = TRUE THEN quantity * priceBooklet WHEN productTypeId <> 4 AND addBooklet = FALSE AND isFromDeposit = TRUE THEN quantity * priceAccess END)) END)`
                  ),
                  "allDeposits",
                ],
              ],
            },
            group: ["OrganizationCustomer.id"],
            raw: true,
          }),
        ]);
        logger.info(
          `${chalk.yellow("OK!")} - ${chalk.red(
            req.ip
          )}  - Пополнение депозита!`
        );
        res.json({
          title: "Пополнение депозита",
          productsList: productsDeposit,
          organizations: organizations,
        });
        break;
    }
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});

async function getOrganizationList(accountId) {
  try {
    const account = await Account.findByPk(accountId);
    if (account) {
      const organizationsList = account.organizationList;
      return organizationsList;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
