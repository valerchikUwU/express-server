const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require("sequelize");
const OrganizationCustomer = require("../../models/organizationCustomer");

exports.organizations_list = asyncHandler(async (req, res, next) => {
  try {
    const organizations = await OrganizationCustomer.findAll({ raw: true });
    res.json({
      title: "Список организаций",
      organizations: organizations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ой, что - то пошло не так!" });
  }
});
