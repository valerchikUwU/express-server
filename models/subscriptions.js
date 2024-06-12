const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');



const Subscriptions = sequelize.define('Subscriptions', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },

   endpoint: {
      type: DataTypes.STRING,
      allowNull: false
   },
   expirationTime: {
      type: DataTypes.STRING,
      allowNull: true
   },
   keys: {
      type: DataTypes.JSON,
      allowNull: false
   },
},
   {
      // Можно добавить дополнительные настройки модели здесь
   });


module.exports = Subscriptions;
