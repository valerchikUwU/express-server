const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');


const CommisionRecieverOperations = sequelize.define('CommisionRecieverOperations', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },
   

   dateOfOperation: {
      type: DataTypes.DATE,
      allowNull: false
   },
   Postyplenie: {
      type: DataTypes.DECIMAL,
      allowNull: true
   },
   Spisanie: {
      type: DataTypes.DECIMAL,
      allowNull: true
   },
   billNumber: {
       type: DataTypes.STRING,
       allowNull: true
   },






}, {
   // Можно добавить дополнительные настройки модели здесь
});




module.exports = CommisionRecieverOperations;
