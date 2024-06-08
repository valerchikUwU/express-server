const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const CommisionRecieverOperations = require('../../models/commisionRecieverOperations');

exports.operation_create = [

    body("billNumber", "Номер счета должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("Postyplenie", "Сумма поступления должна быть указана")
        .trim()
        .isInt({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);


        const operation = new CommisionRecieverOperations({
            billNumber: req.body.billNumber,
            Postyplenie: req.body.Postyplenie,
            dateOfOperation: new Date(),
            Spisanie: null
        })


        if (!errors.isEmpty()) {

            res.json({
                title: "Некорректная форма создания прайс листа!",
                operation: operation,
                errors: errors.array(),
            });
        }
        else {
            await operation.save();
            res.status(200).send('Поступление для получателя комиссии успешно создано!');
        }
    }),
];
