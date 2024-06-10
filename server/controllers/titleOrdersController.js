const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, and, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');
const OrganizationCustomer = require('../../models/organizationCustomer');
const sequelize = require('../../database/connection');





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
    body("titlesToUpdate.*.addBooklet")
        .if(body("addBooklet").exists())
        .escape(),
    body().custom((value, { req }) => {
        const titlesToUpdate = req.body.titlesToUpdate;
        for (const title of titlesToUpdate) {
            // Проверяем, что если addBooklet равен 1, то accessType не может быть ни 'Бумажный', ни 'Электронный'
            if (title.addBooklet === false && title.accessType === undefined) {
                res.status(400).json({ error: 'Выберите тип доступа!' });
            }
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const order = await Order.findByPk(req.params.orderId)
        if (order.status !== 'Черновик') {
            res.status(400).send('Редактировать можно только черновик!')
        }
        const titlesToUpdate = req.body.titlesToUpdate;
        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all([
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } })
            ]);


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
                                type: sequelize.QueryTypes.SELECT
                            }
                        );
                        const actualDate = actualActivationDate[0]['MAX(activationDate)'];
                        const priceDef = await PriceDefinition.findOne({
                            where: { activationDate: actualDate }
                        });
                        oldTitle.priceDefId = priceDef.id
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
                    }
                    else {
                        oldTitle.addBooklet = title.addBooklet;
                    }
                    await oldTitle.save();
                }
            }
            res.status(200).send('Наименования успешно обновлены!');
        }
    }),
];



exports.title_delete = asyncHandler(async (req, res, next) => {

    const title = await TitleOrders.findByPk(req.params.titleId);

    if (title === null) {
        // No results.
        res.status(404).send('Наименование не найдено!');
    }

    await TitleOrders.destroy({ where: { id: req.params.titleId } });
    res.status(200).send('Наименование успешно удалено!');

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
    body("billNumber")
        .optional({ checkFalsy: true })
        .escape(),
    body("payeeId")
        .optional({ checkFalsy: true })
        .escape(),
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
    body("titlesToUpdate.*.addBooklet")
        .if(body("addBooklet").exists())
        .escape(),
    body().custom((value, { req }) => {
        const titlesToUpdate = req.body.titlesToUpdate;
        for (const title of titlesToUpdate) {
            if (title.addBooklet === 1 && title.accessType !== null) {
                throw new Error('Буклет представлен только в виде бумажного формата!');
            }
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const titlesToUpdate = req.body.titlesToUpdate;
        const organizationCustomer = await OrganizationCustomer.findOne({
            where: { organizationName: req.body.organizationName }
        });

        const order = new Order({
            organizationCustomerId: organizationCustomer.id,
            status: req.body.status,
            billNumber: req.body.billNumber,
            payeeId: req.body.payeeId,
            isFromDeposit: req.body.isFromDeposit,
            dispatchDate: req.body.status === 'Отправлен' ? new Date() : null,
            _id: req.params.orderId
        });


        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all([
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } })
            ]);


            res.json({
                title: "Некорректная форма обновления!",
                titleOrders: titleOrders,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {


            const oldOrder = await Order.findByPk(req.params.orderId);

            if (oldOrder.status !== 'Оплачен' && oldOrder.status !== 'Отправлен' && oldOrder.status !== 'Отменен') {
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
                                    type: sequelize.QueryTypes.SELECT
                                }
                            );
                            const actualDate = actualActivationDate[0]['MAX(activationDate)'];
                            const priceDef = await PriceDefinition.findOne({
                                where: { activationDate: actualDate }
                            });
                            oldTitle.priceDefId = priceDef.id
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
                        }
                        else {
                            oldTitle.addBooklet = title.addBooklet;
                        }
                        await oldTitle.save();
                    }
                }
            }


            oldOrder.organizationCustomerId = order.organizationCustomerId;
            oldOrder.status = order.status;
            oldOrder.billNumber = order.billNumber;
            oldOrder.payeeId = order.payeeId;
            oldOrder.isFromDeposit = order.isFromDeposit;
            oldOrder.dispatchDate = order.dispatchDate;
            await oldOrder.save();

            res.status(200).send('Наименования успешно обновлены');
        }
    }),
];