const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const Account = require("../../models/account");
const OrganizationCustomer = require("../../models/organizationCustomer");
const Role = require("../../models/role");
const dateFns = require("date-fns");
const createHttpError = require("http-errors");
const { logger } = require("../../configuration/loggerConf");
const chalk = require("chalk");

exports.accounts_list = asyncHandler(async (req, res, next) => {
  try {
    const accounts = await Account.findAll({ where: { roleId: 3 }, raw: true });
    accounts.forEach((account) => {
      account.formattedLastSeen = account.lastSeen
        ? dateFns.format(account.lastSeen, "HH:mm dd.MM")
        : null;
    });

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Успешный вывод списка аккаунтов для админа`
    );

    res.json({
      title: "Список аккаунтов",
      accounts: accounts,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.superAdmin_accounts_list = asyncHandler(async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      where: {
        roleId: {
          [Op.or]: [2, 3],
        },
      },
      raw: true,
    });
    accounts.forEach((account) => {
      account.formattedLastSeen = account.lastSeen
        ? dateFns.format(account.lastSeen, "HH:mm dd.MM")
        : null;
    });

    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Успешный вывод списка аккаунтов для суперАдмина`
    );
    res.json({
      title: "Список аккаунтов",
      accounts: accounts,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});

exports.account_organization_create_get = asyncHandler(
  async (req, res, next) => {
    try {
      const allOrganizations = await OrganizationCustomer.findAll({
        order: ["organizationName"],
      });

      logger.info(
        `${chalk.yellow("OK!")} - ${chalk.red(
          req.ip
        )}  - Успешный вывод формы создания аккаунта для админа!`
      );
      res.json({
        title: "Форма создания аккаунта для админа",
        organizations: allOrganizations,
      });
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так!" });
    }
  }
);

exports.account_organization_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.organizationList)) {
      req.body.organizationList =
        typeof req.body.organizationList === "undefined"
          ? []
          : [req.body.organizationList];
    }
    next();
  },

  body("firstName", "Имя должно быть указано!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
  // .withMessage('Имя может содержать только русские буквы и пробелы'),
  body("lastName", "Фамилия должна быть указана!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
  // .withMessage('Фамилия может содержать только русские буквы и пробелы'),
  body("telephoneNumber", "Номер телефона должен быть указан!")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  // .matches(/^\+7\d{10}$/, 'ru-RU')
  // .withMessage('Номер телефона должен начинаться с +7 и содержать 10 цифр'),
  body("organizationList.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    try {
      for (const organization of req.body.organizationList) {
        if (
          (await OrganizationCustomer.findOne({
            where: { organizationName: organization },
          })) === null
        ) {
          const org = await OrganizationCustomer.create({
            organizationName: organization,
          });
          await org.save();
        }
      }

      const account = new Account({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephoneNumber: req.body.telephoneNumber,
        organizationList: req.body.organizationList,
        roleId: 3,
      });

      if (!errors.isEmpty()) {
        const [allOrganizations] = await Promise.all([
          OrganizationCustomer.findAll({ order: [["organizationName"]] }),
        ]);

        logger.error(errors.array());
        res.json({
          title: "Некорректная форма создания аккаунта!",
          organizations: allOrganizations,
          account: account,
          errors: errors.array(),
        });
      } else {
        
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Аккаунт успешно создан!`
    );
        await account.save();
        res.status(200).json({ message: "Аккаунт успешно создан!" });
      }
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }),
];

exports.superAdmin_account_organization_create_get = asyncHandler(
  async (req, res, next) => {
    try {
      const [allOrganizations, allRoles] = await Promise.all([
        OrganizationCustomer.findAll({ order: [["name"]] }),
        Role.findAll({
          where: {
            id: {
              [Op.ne]: 1,
            },
          },
        }),
      ]);

      logger.info(
        `${chalk.yellow("OK!")} - ${chalk.red(
          req.ip
        )}  - Форма создания аккаунта для суперАдмина!`
      );
      res.json({
        title: "Форма создания аккаунта для суперАдмина",
        organizations: allOrganizations,
        allRoles: allRoles,
      });
    } catch (err) {
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }
);

exports.superAdmin_account_organization_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.organizationList)) {
      req.body.organizationList =
        typeof req.body.organizationList === "undefined"
          ? []
          : [req.body.organizationList];
    }
    next();
  },

  body("firstName", "Имя должно быть указано!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
  // .withMessage('Имя может содержать только русские буквы и пробелы'),
  body("lastName", "Фамилия должна быть указана!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
  // .withMessage('Фамилия может содержать только русские буквы и пробелы'),
  body("telephoneNumber", "Номер телефона должен быть указан!")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  // .matches(/^\+7\d{10}$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
  // .withMessage('Номер телефона должен начинаться с +7 и содержать 10 цифр'),
  body("roleId", "Роль должна быть выбрана!")
    .isIn([2, 3])
    .isLength({ min: 1 })
    .escape(),
  body("organizationList.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    try{
      for (const organization of req.body.organizationList) {
        if (
          (await OrganizationCustomer.findOne({
            where: { organizationName: organization },
          })) === null
        ) {
          const org = await OrganizationCustomer.create({
            organizationName: organization,
          });
          await org.save();
        }
      }

    const account = new Account({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      telephoneNumber: req.body.telephoneNumber,
      organizationList: req.body.organizationList,
      roleId: req.body.roleId,
    });

    if (!errors.isEmpty()) {
      const [allOrganizations, allRoles] = await Promise.all([
        OrganizationCustomer.findAll({ order: [["name"]] }),
        Role.findAll({
          where: {
            id: {
              [Op.ne]: 1,
            },
          },
        }),
      ]);
      logger.error(errors.array());
      res.json({
        organizations: allOrganizations,
        allRoles: allRoles,
        account: account,
        errors: errors.array(),
      });
    } else {
      logger.info(
        `${chalk.yellow("OK!")} - ${chalk.red(
          req.ip
        )}  - Аккаунт успешно создан!`
      );
        await account.save();
        res.status(200).json({ message: "Аккаунт успешно создан!" });
    }
    }
    catch(err){
      
      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({message: 'Ой, что - то пошло не так!'})
    }
      
  }),
];

exports.account_update_get = asyncHandler(async (req, res, next) => {
  try {
    const [account, allOrganizations] = await Promise.all([
      Account.findByPk(req.params.accountFocusId, { raw: true }),
      OrganizationCustomer.findAll(),
    ]);

    account.formattedLastSeen =
      account.lastSeen !== null
        ? dateFns.format(account.lastSeen, "HH:mm dd.MM")
        : null;

    if (!account) {
      const err = new Error("Аккаунт не найден!");
      err.status = 404;
      return next(err);
    }

    
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(
        req.ip
      )}  - Форма обновления аккаунта для админа`
    );
    res.json({
      title: "Форма обновления аккаунта для админа",
      organizations: allOrganizations,
      account: account,
    });
  } catch (err) {
    
    err.ip = req.ip;
    logger.error(err);
    if (err.status === 404) {
      res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Ой, что - то пошло не так" });
  }
});

exports.account_update_put = [
  body("firstName")
    .if(body("firstName").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^[а-яА-ЯёЁ\s]+$/)
    .withMessage("Имя может содержать только русские буквы и пробелы"),
  body("lastName")
    .if(body("lastName").exists())
    .trim()
    .isLength({ min: 1 })
    .escape()
    .matches(/^[а-яА-ЯёЁ\s]+$/)
    .withMessage("Фамилия может содержать только русские буквы и пробелы"),
  body("telephoneNumber")
    .if(body("telephoneNumber").exists())
    .trim()
    .isLength({ min: 10 })
    .escape()
    .matches(/^\+7\d{10}$/)
    .withMessage("Номер телефона должен начинаться с +7 и содержать 10 цифр"),
  body("organizationList.*").escape(),

  asyncHandler(async (req, res, next) => {
    try{

      const errors = validationResult(req);
      const account = new Account({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephoneNumber: req.body.telephoneNumber,
        organizationList: req.body.organizationList,
        _id: req.params.accountFocusId,
      });
  
      if (!errors.isEmpty()) {
        const [allOrganizations] = await Promise.all([
          OrganizationCustomer.findAll(),
        ]);
        logger.error(errors.array());
        res.json({
          title: "Форма ввода некорректна, повторите попытку!",
          organizations: allOrganizations,
          account: account,
          errors: errors.array(),
        });
        return;
      } else {
          const oldAccount = await Account.findByPk(req.params.accountFocusId);
          oldAccount.firstName = account.firstName;
          oldAccount.lastName = account.lastName;
          oldAccount.telephoneNumber = account.telephoneNumber;
          oldAccount.organizationList = account.organizationList;
  
          await oldAccount.save();
        
          logger.info(
            `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Аккаунт успешно обновлен!`
          );
        res.status(200).json({ message: "Аккаунт успешно обновлен!" });
      }
    }
    catch(err){

      err.ip = req.ip;
      logger.error(err);
      res.status(500).json({ message: "Ой, что - то пошло не так" });
    }
  }),
];

