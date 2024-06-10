const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const ProductType = require('../../models/productType');
const Product = require('../../models/product');
const OrganizationCustomer = require('../../models/organizationCustomer');
const Account = require('../../models/account');
const Order = require('../../models/order');
const PriceDefinition = require('../../models/priceDefinition');
const TitleOrders = require('../../models/titleOrders');
const sequelize = require('../../database/connection');


exports.all_products = asyncHandler(async (req, res, next) => {
  const allProduct = Product.findAll()

  res.json({
    title: "Все продукты",
    allProduct: allProduct,
  });
})



exports.products_list = asyncHandler(async (req, res, next) => {
  const productTypeId = parseInt(req.params.typeId, 10);

  if (isNaN(productTypeId)) {
    return res.status(400).json({ error: 'Неверный тип товара!' });
  }

  switch (productTypeId) {
    case 1:
      const productsInit = await sequelize.query(`
      SELECT Products.*
        FROM Products, PriceDefinitions
        WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
          (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
          AND Products.productTypeId = 1
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({
        title: "Начальные",
        productsList: productsInit,
      });
      break;
    case 2:
      const productsMain = await sequelize.query(`
      SELECT Products.*
        FROM Products, PriceDefinitions
        WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
          (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
          AND Products.productTypeId = 2
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({
        title: "Основные",
        productsList: productsMain,
      });
      break;
    case 3:
      const productsForEmployers = await sequelize.query(`
      SELECT Products.*
        FROM Products, PriceDefinitions
        WHERE PriceDefinitions.productId = Products.id AND PriceDefinitions.activationDate = 
          (SELECT MAX(activationDate) FROM PriceDefinitions WHERE PriceDefinitions.productId = Products.id AND activationDate < NOW())
          AND Products.productTypeId = 3
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({
        title: "Для персонала",
        productsList: productsForEmployers,
      });
      break;
    case 4:
      const organizationsList = await getOrganizationList(req.params.accountId);
      const [productsDeposit, organizations] = await Promise.all([

        await Product.findAll({
          where: { productTypeId: productTypeId },
          raw: true
        }),
        await OrganizationCustomer.findAll({
          where:
          {
            organizationName:
            {
              [Op.in]: organizationsList
            }
          },
          include:
            [
              {
                model: Order,
                where: {
                  status:
                  {
                    [Op.notIn]:
                      [
                        'Получен',
                        'Черновик',
                        'Черновик депозита',
                        'Отменен'
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
                          },
                          {
                            model: Product,
                            attributes: [],
                            as: 'product'
                          }
                        ],
                      attributes: [],
                    }
                  ],
                attributes: [],
                as: 'orders'
              }
            ],
          attributes:
          {
            include:
              [

                [
                  Sequelize.literal(`(SUM(CASE WHEN productTypeId = 4 THEN (quantity*1) END)) - (CASE WHEN status = 'Активный' OR status = 'Отправлен' OR status = 'Получен' THEN (SUM(CASE WHEN productTypeId <> 4 AND addBooklet = TRUE AND isFromDeposit = TRUE THEN quantity * priceBooklet WHEN productTypeId <> 4 AND addBooklet = FALSE AND isFromDeposit = TRUE THEN quantity * priceAccess END)) END)`), 'allDeposits'
                ]
              ]
          },
          group: ['OrganizationCustomer.id'],
          raw: true
        })
      ]);


      res.json({
        title: "Пополнение депозита",
        productsList: productsDeposit,
        organizations: organizations
      });
      break;

  }

});









async function getOrganizationList(accountId) {
  try {
    const account = await Account.findOne({
      where: {
        id: accountId
      }
    });
    if (account) {
      const organizationsList = account.organizationList;
      return organizationsList;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка получения списка организаций данного аккаунта:', error);
    return null;
  }
}