const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');


const Review = sequelize.define('Review', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },

   name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   dataType: {
      type: DataTypes.ENUM('Заказы', 'Товары', 'Комиссионные'),
      allowNull: false
   },

   calculatedNumber:{
      type: DataTypes.DECIMAL,
      allowNull: false
   },

}, {
   // Можно добавить дополнительные настройки модели здесь
});




module.exports = Review;
