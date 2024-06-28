const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const AccrualRule = require("../../models/accrualRule");
const Product = require("../../models/product");
const ProductType = require("../../models/productType");
const CommisionReciever = require("../../models/commisionReceiver");
const sequelize = require("../../database/connection");
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

exports.accrualRule_create_get = asyncHandler(async (req, res, next) => {
  try {
    const [allProducts, allProductTypes] = await Promise.all([
      Product.findAll({ order: [["name"]] }),
      ProductType.findAll(),
    ]);

    
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Создание правила пополнения!`
    );
    res.json({
      title: "Создание правила пополнения",
      allProducts: allProducts,
      allProductTypes: allProductTypes,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.accrualRule_create_post = [
  body("rulesToCreate.*.productTypeId")
    .if(body("productTypeId").exists())
    .isNumeric()
    .withMessage("Тип продукта должен быть числом")
    .isIn([1, 2, 3])
    .withMessage("Тип продукта может быть только 1, 2 или 3"),
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
        const err = new Error("Выберите категорию или конкретный товар!")
        err.status = 400;
        err.ip = req.ip
        logger.error(err)
        return res.status(400).json({ message: err.message });
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try{
      const errors = validationResult(req);

      const rulesToCreate = req.body.rulesToCreate;
      if (!errors.isEmpty()) {
        res.json({
          rulesToCreate: rulesToCreate,
          errors: errors.array(),
        });
      } else {
        for (const rule of rulesToCreate) {
          const newRule = new AccrualRule({
            productTypeId: rule.productTypeId,
            productId: rule.productId,
            accessType: rule.accessType,
            generation: rule.generation,
            commision: rule.commision,
            commisionRecieverId: req.params.commisionRecieverId,
          });
  
            await newRule.save();
        }
        
      logger.info(
        `${chalk.yellow("OK!")} - ${chalk.red(
          req.ip
        )}  - Правила начисления комиссии успешно создано!`
      );
        res.status(200).json({ message: "Правила начисления комиссии успешно создано!" });
      }
    }
    catch(err){
      
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });

    }
    
  }),
];

exports.accrualRule_update_put = [
  // Validate and sanitize fields.
  body("rulesToUpdate.*.productTypeId")
    .optional({nullable: true})
    .if(body("rulesToUpdate.*.productTypeId").exists())
    .isNumeric()
    .withMessage("Тип продукта должен быть числом")
    .isIn([1, 2, 3])
    .withMessage("Тип продукта может быть только 1, 2 или 3")
    .escape(),
  body("rulesToUpdate.*.productId")
    .optional({nullable: true})
    .if(body("rulesToUpdate.*.productId").exists())
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("rulesToUpdate.*.accessType")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Электронный|Бумажный)$/i),
  body("rulesToUpdate.*.generation")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^(Второе поколение|Первое поколение)$/i),
  body("rulesToUpdate.*.commision").isInt({ min: 1 }).escape(),
  body().custom((value, { req }) => {
    const rulesToUpdate = req.body.rulesToUpdate;
    for (const rule of rulesToUpdate) {
      // Проверяем, что если addBooklet равен 1, то accessType не может быть ни 'Бумажный', ни 'Электронный'
      if (rule.productTypeId !== null && rule.productId !== null) {
        const err = new Error("Выберите категорию или конкретный товар!")
        err.status = 400;
        err.ip = req.ip;
        logger.error(err);
        return res.status(400).json({ message: err.message });
      }
    }
    // Возвращаем true, если условие выполнено
    return true;
  }),

  asyncHandler(async (req, res, next) => {
    try{

      const errors = validationResult(req);

      const rulesToUpdate = req.body.rulesToUpdate;
      if (!errors.isEmpty()) {
        const [commisionReciever, rulesToUpdate] = await Promise.all([
          CommisionReciever.findByPk(req.params.commisionRecieverId),
          AccrualRule.findAll({
            where: { commisionRecieverId: req.params.commisionRecieverId },
          }),
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
  
              if (rule.productTypeId !== null) {
                oldRule.productTypeId = rule.productTypeId;
                oldRule.productId = null;
              }
              else if(rule.productId !== null) {
                oldRule.productId = rule.productId;
                oldRule.productTypeId = null;
              }
  
              if (rule.generation) {
                oldRule.generation = rule.generation;
              }
              if (rule.accessType) {
                oldRule.accessType = rule.accessType;
              }
              await oldRule.save();
            } else {
              const newRule = new AccrualRule({
                productTypeId: rule.productTypeId,
                productId: rule.productId,
                accessType: rule.accessType,
                generation: rule.generation,
                commision: rule.commision,
                commisionRecieverId: req.params.commisionRecieverId,
              });
  
              await newRule.save();
            }
          }
          
      logger.info(
        `${chalk.yellow("OK!")} - ${chalk.red(
          req.ip
        )}  - Правила успешно обновлены!`
      );
        res.status(200).json({ message: "Правила успешно обновлены!" });
      }
    }
    catch(err){
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });

    }
  }),
];

exports.accrualRule_delete = asyncHandler(async (req, res, next) => {
  try {
    const [rule] = await Promise.all([AccrualRule.findByPk(req.params.ruleId)]);
    if (rule.id === null) {
      res.status(404).json({ message: "Такое правило не найдено!" });
    }

    await AccrualRule.destroy({ where: { id: req.params.ruleId } });
    
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Правило начисления комиссии успешно удалено!`
    );
    res.status(200).json({ message: "Правило начисления комиссии успешно удалено!" });
  } 
  catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});
