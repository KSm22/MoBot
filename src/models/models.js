const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Film = sequelize.define('Film', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filmId: {
        type: DataTypes.INTEGER,
    }
});

module.exports = {
    Film
};
