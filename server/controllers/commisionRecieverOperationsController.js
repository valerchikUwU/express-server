const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const CommisionRecieverOperations = require('../../models/commisionRecieverOperations');
const CommisionReciever = require('../../models/commisionReceiver');
const { logger } = require("../../configuration/loggerConf")
const chalk = require("chalk");

exports.operation_create = [

    body("billNumber", "Номер счета должен быть указан")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("Spisanie", "Сумма списания должна быть указана")
        .trim()
        .isInt({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);


        const operation = new CommisionRecieverOperations({
            billNumber: req.body.billNumber,
            Spisanie: req.body.Spisanie,
            dateOfOperation: new Date(),
            commisionRecieverId: req.params.commisionRecieverId,
            Postyplenie: null
        })


        if (!errors.isEmpty()) {

            res.json({
                title: "Некорректная форма создания операции!",
                operation: operation,
                errors: errors.array(),
            });
        }
        else {
            await operation.save();
            res.status(200).send('Операция для получателя комиссии успешно создана!');
        }
    }),
];
