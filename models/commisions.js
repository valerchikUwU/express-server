const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Commision = sequelize.define('Commision', {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    commision: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    billNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    generation: {
        type: DataTypes.ENUM('Первое поколение', 'Второе поколение'),
        allowNull: true
    },





}, {
    // Можно добавить дополнительные настройки модели здесь
});

module.exports = Commision;