const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const AccrualRule = require('../../models/accrualRule');
const Product = require('../../models/product');
const ProductType = require('../../models/productType');
const CommisionReciever = require('../../models/commisionReceiver');
const sequelize = require('../../database/connection');

exports.accrualRule_create_get = asyncHandler(async (req, res, next) => {
    const [allProducts, allProductTypes] = await Promise.all([
        Product.findAll({ order: [['name']] }),
        ProductType.findAll()
    ]);

    res.json({
        title: "Создание правила пополнения",
        allProducts: allProducts,
        allProductTypes: allProductTypes
    });
});


exports.accrualRule_create_post = [


    body("rulesToCreate.*.productTypeId")
        .if(body("productTypeId").exists())
        .isNumeric()
        .withMessage('Тип продукта должен быть числом')
        .isIn([1, 2, 3])
        .withMessage('Тип продукта может быть только 1, 2 или 3'),
    body("rulesToCreate.*.productId")
        .if(body("productId").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("rulesToCreate.*.generation")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^(Второе поколение|Первое поколение)$/i),
    body("rulesToCreate.*.accessType")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^(Электронный|Бумажный)$/i),
    body("rulesToCreate.*.commision", "Размер комиссии должен быть указан!")
        .isInt({ min: 1 })
        .escape(),
    body().custom((value, { req }) => {
        const rulesToCreate = req.body.rulesToCreate;
        for (const rule of rulesToCreate) {
            // Проверяем, что если addBooklet равен 1, то accessType не может быть ни 'Бумажный', ни 'Электронный'
            if (rule.productTypeId !== null && rule.productId !== null) {
                res.status(400).json({ error: 'Выберите категорию или конкретный товар!' });
            }
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const rulesToCreate = req.body.rulesToCreate;
        if (!errors.isEmpty()) {

            res.json({
                rulesToCreate: rulesToCreate,
                errors: errors.array(),
            });
        }
        else {
            for (const rule of rulesToCreate) {

                const newRule = new AccrualRule({
                    productTypeId: rule.productTypeId,
                    productId: rule.productId,
                    accessType: rule.accessType,
                    generation: rule.generation,
                    commision: rule.commision,
                    commisionRecieverId: req.params.commisionRecieverId
                });
        
        
                await newRule.save();
            }
            res.status(200).send('Правила начисления комиссии успешно создано!');
        }
    }),
];



exports.accrualRule_update_put = [




    // Validate and sanitize fields.
    body("rulesToUpdate.*.productTypeId")
        .if(body("productTypeId").exists())
        .isNumeric()
        .withMessage('Тип продукта должен быть числом')
        .isIn([1, 2, 3])
        .withMessage('Тип продукта может быть только 1, 2 или 3')
        .escape(),
    body("rulesToUpdate.*.productId")
        .if(body("productId").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("rulesToUpdate.*.accessType")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^(Второе поколение|Первое поколение)$/i),
    body("rulesToUpdate.*.generation")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^(Электронный|Бумажный)$/i),
    body("rulesToUpdate.*.commision")
        .isInt({ min: 1 })
        .escape(),
    body().custom((value, { req }) => {
        const rulesToUpdate = req.body.rulesToUpdate;
        for (const rule of rulesToUpdate) {
            // Проверяем, что если addBooklet равен 1, то accessType не может быть ни 'Бумажный', ни 'Электронный'
            if (rule.productTypeId !== null && rule.productId !== null) {
                res.status(400).json({ error: 'Выберите категорию или конкретный товар!' });
            }
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const rulesToUpdate = req.body.rulesToUpdate;
        if (!errors.isEmpty()) {
            const [commisionReciever, rulesToUpdate] = await Promise.all([
                CommisionReciever.findByPk(req.params.commisionRecieverId),
                AccrualRule.findAll({ where: { commisionRecieverId: req.params.commisionRecieverId } })
            ]);


            res.json({
                title: "Некорректное обновление правил начисления",
                rulesToUpdate: rulesToUpdate,
                commisionReciever: commisionReciever,
                errors: errors.array(),
            });
            return;
        } else {

            for (const rule of rulesToUpdate) {
                const oldRule = await AccrualRule.findByPk(rule.id);
                if (oldRule) {
                    // Проверяем, были ли предоставлены новые значения для полей

                    if (rule.productTypeId) {
                        oldRule.productTypeId = rule.productTypeId;
                        oldRule.productId = null;
                    }

                    if (rule.productId) {
                        oldRule.productId = rule.productId;
                        oldRule.productTypeId = null;
                    }

                    if (rule.generation) {
                        oldRule.generation = rule.generation;
                    }
                    if (rule.accessType) {
                        oldRule.accessType = rule.addBooklet;
                    }
                    await oldRule.save();
                }
            }
            res.status(200).send('Правила успешно обновлены!');
        }
    }),
];


exports.accrualRule_delete = asyncHandler(async (req, res, next) => {


    const [rule] = await Promise.all([
        AccrualRule.findByPk(req.params.ruleId)
    ]);

    if (rule.id === null) {
        res.status(404).send('Такое правило не найдено!');
    }



    await AccrualRule.destroy({ where: { id: req.params.ruleId } });
    res.status(200).send('Правило начисления комиссии успешно создано!');

});
