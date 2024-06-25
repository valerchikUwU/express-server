const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');



const History = sequelize.define('History', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },
   billNumber: {
      type: DataTypes.STRING,
      allowNull: false
   },
   orderStatus: {
    type: DataTypes.ENUM('Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен', 'Отправлен', 'Получен', 'Отменен'),
    allowNull: false
   },
   timestamp: {
      type: DataTypes.DATE,
      allowNull: false
   },
},
   {
      // Можно добавить дополнительные настройки модели здесь
   });


module.exports = History;
