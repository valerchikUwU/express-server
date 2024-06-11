const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Payee = require('../../models/payee');


exports.payee_list = asyncHandler(async (req, res, next) => {
    const allPayees = await Payee.findAll();
    res.json({
        title: "Список получателей платежа",
        payees_list: allPayees
    })
});


  
exports.payee_create_post = [
    
  
  
    body("name", "Наименование получателя должно быть указано!")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  
  
    asyncHandler(async (req, res, next) => {
  
      const errors = validationResult(req);
  
  
      const payee = new Payee({
        name: req.body.name
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
  
  
        res.json({
          payee: payee,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save product.
        await payee.save();
        res.status(200).send('Получатель успешно создан!');
      }
    }),
  ];