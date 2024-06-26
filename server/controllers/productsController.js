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
const History = require("../../models/history.js");
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
      SELECT DISTINCT Products.*, COALESCE(images.path, '') AS imagePath
        FROM Products
        JOIN PriceDefinitions ON PriceDefinitions.productId = Products.id
        LEFT JOIN Images images ON images.id = Products.imageId 
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
        LEFT JOIN Images images ON images.id = Products.imageId 
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
        LEFT JOIN Images images ON images.id = Products.imageId 
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
                    `SUM(CASE WHEN productTypeId = 4 AND quantity > 0 THEN (quantity*1) END)`
                  ),
                  "deposits",
                ],
                [
                  Sequelize.literal(
                    `SUM(CASE WHEN  addBooklet = TRUE AND isFromDeposit = TRUE THEN quantity * priceBooklet WHEN addBooklet = FALSE AND isFromDeposit = TRUE THEN quantity * priceAccess WHEN productTypeId = 4 AND createdBySupAdm = TRUE AND quantity < 0 THEN (quantity * -1) END)`
                  ),
                  "allSpisanie",
                ]
              ],
            },
            group: ["OrganizationCustomer.id"],
            raw: true,
          }),
        ]);
        console.log(organizations);
        organizations.forEach((org) => {
          org.deposits = org.deposits ? Number(org.deposits)*1 : 0;
          org.allSpisanie = org.allSpisanie ? Number(org.allSpisanie)*1 : 0
          org.allDeposits = org.deposits - org.allSpisanie;
        });
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
