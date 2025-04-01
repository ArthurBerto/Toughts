const { Sequelize } = require("sequelize");

// Conectando com o banco de dados
const sequelize = new Sequelize("toughts", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log(`Conectamos com sucesso!`);
} catch (err) {
  console.log(`Não foi possível conectar: ${err}`);
}

module.exports = sequelize;
