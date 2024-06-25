const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const OrganizationCustomer = require("../../models/organizationCustomer");
const { logger } = require("../../configuration/loggerConf")
const chalk = require("chalk");

exports.organizations_list = asyncHandler(async (req, res, next) => {
  try {
    const organizations = await OrganizationCustomer.findAll({ raw: true });

    
    logger.info(
      `${chalk.yellow("OK!")} - ${chalk.red(req.ip)}  - Список организаций!`
    );
    res.json({
      title: "Список организаций",
      organizations: organizations,
    });
  } catch (err) {
    err.ip = req.ip;
    logger.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});
