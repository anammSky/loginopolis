const { Sequelize, sequelize } = require("./db");

const Pet = sequelize.define("Pet", {
  name: Sequelize.STRING,
  type: Sequelize.STRING,
});

module.exports = { Pet };
