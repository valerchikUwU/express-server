const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Payee = require('../../models/payee');


exports.payee_list = asyncHandler(async (req, res, next) => {
  try{
    const allPayees = await Payee.findAll();
    res.json({
        title: "Список получателей платежа",
        payees_list: allPayees
    })
  }
    catch(err){
      
      console.error(err);
      res.status(500).json({message: 'Ой, что - то пошло не так!'})
    }
});


  
exports.payee_create_post = [
    
  
  
    body("name", "Наименование получателя должно быть указано!")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  
  
    asyncHandler(async (req, res, next) => {
  
      try {
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
          res.status(200).json({message: 'Получатель успешно создан!'});
        }
      }
      catch(err){

        console.error(err);
        res.status(500).json({message: 'Ой, что - то пошло не так!'})
      }
      
    }),
  ];