const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const CommisionReciever = require('../../models/commisionReceiver');
const AccrualRule = require('../../models/accrualRule');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');
const ProductType = require('../../models/productType');
const sequelize = require('../../database/connection');



exports.commisionReciever_list = asyncHandler(async (req, res, next) => {
    try {
        const allCommisionRecievers = await CommisionReciever.findAll(
            {
                include:
                    [
                        {
                            model: AccrualRule,
                            as: 'rules',
                            attributes: []
                        }
                    ],
                attributes: {
                    include: [
                        [Sequelize.fn('COUNT', Sequelize.col('rules.id')), 'rulesQuantity']
                    ]
                },

                group: ['CommisionReciever.id'],
            });

        

    res.json({
        title: "Список получателей комиссии",
        allCommisionRecievers: allCommisionRecievers
    })
    }
    catch (err) {
        console.log(err)
    }
});


exports.commisionReciever_rules_details = asyncHandler(async (req, res, next) => {

    const [commisionReciever, allRules] = await Promise.all([
        CommisionReciever.findByPk(req.params.commisionRecieverId),
        AccrualRule.findAll({ where: { commisionRecieverId: req.params.commisionRecieverId } })
    ]);

    if (commisionReciever === null) {
        const err = new Error("Такой получатель комиссии не найден!");
        err.status = 404;
        return next(err);
    }


    res.json({
        title: `Правила начисления получателя комиссии ${commisionReciever.name}`,
        commisionReciever: commisionReciever,
        allRules: allRules
    });
});


exports.commisionReciever_balance_details = asyncHandler(async (req, res, next) => {
    try {
        const commisionReceiver = await Promise.all([
            CommisionReciever.findByPk(req.params.commisionRecieverId),
            await sequelize.query(`

            /**
            Если accessType != NULL AND generation != NULL
            */
            CREATE TEMPORARY TABLE IF NOT EXISTS first_commission_summaries (
                productId CHAR(35),
                orderId CHAR(35),
                dispatchDate DATETIME,
                billNumber VARCHAR(255),
                titlesId CHAR(35),
                accessType VARCHAR(255),
                generation VARCHAR(255),
                totalCommissionPerRule DECIMAL(10, 2)
            );
            
            INSERT INTO first_commission_summaries (productId, orderId, dispatchDate, billNumber, titlesId, accessType, generation,  totalCommissionPerRule) 
                SELECT 
                    A.productId,
                    titles.orderId,
                    orders.dispatchDate,
                    orders.billNumber,
                    titles.id,
                    A.accessType,
                    A.generation,
                    SUM(A.commision * titles.quantity) AS totalCommissionPerRule
                FROM 
                    AccrualRules A
                JOIN 
                    TitleOrders titles ON A.productId = titles.productId
                JOIN 
                    Orders orders ON titles.orderId = orders.id
                WHERE 
                    orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                    AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                    AND A.accessType IS NOT NULL
                    AND A.generation IS NOT NULL
                    AND A.accessType = titles.accessType
                    AND A.generation = titles.generation
                    AND A.commisionRecieverId = :commisionRecieverId
                GROUP BY 
                    titles.orderId;
            
            
            
            /**
            Если accessType = NULL OR generation = NULL
            */
            
            
            CREATE TEMPORARY TABLE IF NOT EXISTS second_commission_summaries (
                productId CHAR(35),
                orderId CHAR(35),
                dispatchDate DATETIME,
                billNumber VARCHAR(255),
                titlesId CHAR(35),
                accessType VARCHAR(255),
                generation VARCHAR(255),
                totalCommissionPerRule DECIMAL(10, 2)
            );
            
            
            INSERT INTO second_commission_summaries (productId, orderId, dispatchDate, billNumber, titlesId, accessType, generation,  totalCommissionPerRule)
            SELECT 
                A.productId,
                titles.orderId,
                orders.dispatchDate,
                orders.billNumber,
                titles.id,
                A.accessType,
                A.generation,
                SUM(A.commision * titles.quantity) AS totalCommissionPerRule
            FROM 
                AccrualRules A
            JOIN 
                TitleOrders titles ON A.productId = titles.productId
            JOIN 
                Orders orders ON titles.orderId = orders.id
            WHERE 
                orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                AND (A.accessType IS NULL OR A.generation IS NULL)
                AND (A.accessType = titles.accessType OR A.generation = titles.generation)
                AND NOT EXISTS (
                    SELECT * FROM first_commission_summaries fcs
                    WHERE CAST(fcs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND A.commisionRecieverId = :commisionRecieverId
            GROUP BY 
                titles.orderId;
            
            
            
            /**
            Если accessType = NULL AND generation = NULL
            */
            
            
            CREATE TEMPORARY TABLE IF NOT EXISTS third_commission_summaries (
                productId CHAR(35),
                orderId CHAR(35),
                dispatchDate DATETIME,
                billNumber VARCHAR(255),
                titlesId CHAR(35),
                totalCommissionPerRule DECIMAL(10, 2)
            );
            
            
            INSERT INTO third_commission_summaries (productId, orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
            SELECT 
                A.productId,
                titles.orderId,
                orders.dispatchDate,
                orders.billNumber,
                titles.id,
                SUM(A.commision * titles.quantity) AS totalCommissionPerRule
            FROM 
                AccrualRules A
            JOIN 
                TitleOrders titles ON A.productId = titles.productId
            JOIN 
                Orders orders ON titles.orderId = orders.id
            WHERE 
                orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                AND A.productId IN (SELECT DISTINCT productId FROM TitleOrders)
                AND (A.accessType IS NULL AND A.generation IS NULL)
                AND NOT EXISTS (
                    SELECT * FROM first_commission_summaries fcs
                    WHERE CAST(fcs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND NOT EXISTS (
                    SELECT * FROM second_commission_summaries scs
                    WHERE CAST(scs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND A.commisionRecieverId = :commisionRecieverId
            GROUP BY 
                titles.orderId;
            
            
            /**
            Только для типов
            */
            CREATE TEMPORARY TABLE IF NOT EXISTS fourth_commission_summaries (
                orderId CHAR(35),
                dispatchDate DATETIME,
                billNumber VARCHAR(255),
                titlesId CHAR(35),
                totalCommissionPerRule DECIMAL(10, 2)
            );
            
            INSERT INTO fourth_commission_summaries (orderId, dispatchDate, billNumber, titlesId, totalCommissionPerRule)
            SELECT 
                titles.orderId,
                orders.dispatchDate,
                orders.billNumber,
                titles.id,
                SUM(A.commision * titles.quantity) AS totalCommissionPerRule
            FROM 
                AccrualRules A
            JOIN 
                Products products ON A.productTypeId = products.productTypeId
            JOIN 
                TitleOrders titles ON titles.productId = products.id
            JOIN 
                Orders orders ON titles.orderId = orders.id
            WHERE 
                orders.status IN ('Оплачен', 'Отправлен', 'Получен')
                AND NOT EXISTS (
                    SELECT * FROM first_commission_summaries fcs
                    WHERE CAST(fcs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND NOT EXISTS (
                    SELECT * FROM second_commission_summaries scs
                    WHERE CAST(scs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND NOT EXISTS (
                    SELECT * FROM third_commission_summaries tcs
                    WHERE CAST(tcs.titlesId AS CHAR(35)) = CAST(titles.id AS CHAR(35))
                )
                AND A.commisionRecieverId = :commisionRecieverId
            GROUP BY 
                titles.orderId;
                
                
            CREATE TEMPORARY TABLE IF NOT EXISTS combined_data (
                orderId CHAR(35),
                dispatchDate DATETIME,
                billNumber VARCHAR(255),
                totalCommissionPerRule DECIMAL(10, 2)
            );
            
            
            -- Шаг 2: Заполнение временной таблицы данными
            INSERT INTO combined_data (orderId, dispatchDate, billNumber, totalCommissionPerRule)
            SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM first_commission_summaries
            UNION ALL
            SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM second_commission_summaries
            UNION ALL
            SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM third_commission_summaries
            UNION ALL
            SELECT orderId, dispatchDate, billNumber, totalCommissionPerRule FROM fourth_commission_summaries;
            
            -- Шаг 3: Подсчет суммы по каждой категории
            SELECT 
                orderId,
                dispatchDate,
                billNumber,
                totalCommissionPerRule AS 'Spisanie'
            FROM 
                combined_data;
            
            `, {
                replacements: { commisionRecieverId: req.params.commisionRecieverId}, 
                type: sequelize.QueryTypes.RAW 
            })
        ]);
    
    
        if (commisionReceiver === null) {
            // No results.
            const err = new Error("Получатель комиссии не найден!");
            err.status = 404;
            return next(err);
        }
    
        res.json({
            title: `Баланс получателя комиссии ${commisionReceiver.name}`,
            commisionReceiver: commisionReceiver,
            allSpisanie: allSpisanie
        });
    }
    catch(err){
        console.log(err);
    }
    
});




exports.commisionReciever_create_post = [


    body("commisionRecieverName", "Имя получателя комиссии должно быть указано!")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);


        const commisionReciever = new CommisionReciever({
            name: req.body.commisionRecieverName,
        });

        if (!errors.isEmpty()) {
            res.json({
                commisionReciever: commisionReciever,
                errors: errors.array(),
            });
        } else {
            await commisionReciever.save();
            res.status(200).send('Получатель комиссии успешно создан!');
        }
    }),
];

