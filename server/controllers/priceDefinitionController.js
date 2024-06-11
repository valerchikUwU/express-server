const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');
const ProductType = require('../../models/productType');
const dateFns = require('date-fns');
const sequelize = require('../../database/connection');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');

exports.prices_list = asyncHandler(async (req, res, next) => {

    const pricesInit = await PriceDefinition.findAll({
        include: [{
            model: Product,
            attributes:
                [
                    'name',
                    'abbreviation',
                    'id',
                    'productTypeId'
                ],
            as: 'product',
            where: { productTypeId: 1 }

        }],
        attributes:
        {
            include:
                [
                    [
                        Sequelize.literal(`product.name`), 'productName'
                    ],
                    [
                        Sequelize.literal(`product.abbreviation`), 'productAbbreviation'
                    ],
                    [
                        Sequelize.literal(`product.id`), 'productId'
                    ],
                    [
                        Sequelize.literal(`product.productTypeId`), 'productTypeId'
                    ],
                ]
        },
        group: ['PriceDefinition.id'],
        raw: true
    });
    const pricesMain = await PriceDefinition.findAll({
        include: [{
            model: Product,
            attributes:
                [
                    'name',
                    'abbreviation',
                    'id',
                    'productTypeId'
                ],
            as: 'product',
            where: { productTypeId: 2 }
        }],
        attributes: {
            include: [
                [
                    Sequelize.literal(`product.name`), 'productName'
                ],
                [
                    Sequelize.literal(`product.abbreviation`), 'productAbbreviation'
                ],
                [
                    Sequelize.literal(`product.id`), 'productId'
                ],
                [
                    Sequelize.literal(`product.productTypeId`), 'productTypeId'
                ],
            ]
        },
        group: ['PriceDefinition.id'],
        raw: true
    });
    const pricesForEmployers = await PriceDefinition.findAll({
        include: [{
            model: Product,
            attributes:
                [
                    'name',
                    'abbreviation',
                    'id',
                    'productTypeId'
                ],
            as: 'product',
            where: { productTypeId: 3 }
        }],
        attributes: {
            include: [
                [
                    Sequelize.literal(`product.name`), 'productName'
                ],
                [
                    Sequelize.literal(`product.abbreviation`), 'productAbbreviation'
                ],
                [
                    Sequelize.literal(`product.id`), 'productId'
                ],
                [
                    Sequelize.literal(`product.productTypeId`), 'productTypeId'
                ],
            ]
        },
        group: ['PriceDefinition.id'],
        raw: true
    });
    pricesInit.forEach(prices => {
        prices.formattedActivationDate = prices.activationDate ? dateFns.format(prices.activationDate, 'dd-MM-yyyy') : null;
    });
    pricesMain.forEach(prices => {
        prices.formattedActivationDate = prices.activationDate ? dateFns.format(prices.activationDate, 'dd-MM-yyyy') : null;
    });
    pricesForEmployers.forEach(prices => {
        prices.formattedActivationDate = prices.activationDate ? dateFns.format(prices.activationDate, 'dd-MM-yyyy') : null;
    });
    res.json({
        title: "Список прайс листов",
        pricesInit: pricesInit,
        pricesMain: pricesMain,
        pricesForEmployers: pricesForEmployers,
    });
}
);



exports.price_create_get = asyncHandler(async (req, res, next) => {
    const [products] = await Promise.all([
        Product.findAll()
    ]);
    res.json({
        title: "Форма создания прайс - листа",
        products: products
    });
});


exports.price_create_post = [

    body("name", "Название должно быть указано")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("abbreviation", "Аббревиаутра должна быть указана")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("priceAccess", "Цена доступа должна быть указана")
        .isInt({ min: 1 })
        .escape(),
    body("priceBooklet", "Цена буклета должна быть указана")
        .isInt({ min: 1 })
        .escape(),
    body("productTypeId")
        .isNumeric()
        .withMessage('Тип продукта должен быть числом')
        .isIn([1, 2, 3])
        .withMessage('Тип продукта может быть только 1, 2 или 3')
        .escape(),
    body("activationDate", "Дата активации должна быть не раньше текущей!")
        .toDate()
        .custom((value) => {
            // Проверяем, что дата не раньше сегодня
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня
            return value >= today;
        }),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);





        if (!errors.isEmpty()) {

            res.json({
                title: "Некорректная форма создания прайс листа!",
                errors: errors.array(),
            });
        }
        else {
            const findProd = await Product.findOne({ where: { name: req.body.name } })

            if (findProd === null) {
                const product = new Product({
                    name: req.body.name,
                    abbreviation: req.body.abbreviation,
                    productTypeId: req.body.productTypeId
                })

                await product.save();

                const price = new PriceDefinition({
                    priceAccess: req.body.priceAccess,
                    priceBooklet: req.body.priceBooklet,
                    productId: product.id,
                    activationDate: req.body.activationDate
                });

                await price.save();
            }
            else {
                const price = new PriceDefinition({
                    priceAccess: req.body.priceAccess,
                    priceBooklet: req.body.priceBooklet,
                    productId: findProd.id,
                    activationDate: req.body.activationDate
                });
                await price.save();
            }
            res.status(200).send("Прайс лист успешно создан!");
        }
    }),
];



exports.price_update_get = asyncHandler(async (req, res, next) => {
    const [price] = await Promise.all([
        PriceDefinition.findByPk(req.params.priceDefId, { include: [{ model: Product }] })
    ]);

    if (price.id === null) {
        const err = new Error("Такой прайс лист не найден!");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Форма обновления прайс - листа",
        price: price,
    });
});


exports.price_update_put = [


    body("priceAccess", "priceAccess must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("priceBooklet", "priceBooklet must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const oldPrice = await PriceDefinition.findByPk(req.params.priceDefId);

        const price = new PriceDefinition({
            priceAccess: req.body.priceAccess,
            priceBooklet: req.body.priceBooklet,
            _id: req.body.priceDefId
        });


        if (!errors.isEmpty()) {



            res.json({
                title: "Некорректная форма обновления прайс листа",
                price: price,
                errors: errors.array(),
            });
            return;
        } else {

            oldPrice.priceAccess = price.priceAccess;
            oldPrice.priceBooklet = price.priceBooklet;

            await oldPrice.save();

            // Перенаправляем на страницу с деталями продукта.
            res.status(200).send("Прайс лист успешно обновлен!");
        }
    }),
];