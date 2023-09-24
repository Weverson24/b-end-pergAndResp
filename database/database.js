const Sequelize = require('sequelize')
const connection = new Sequelize("guiaperguntas",process.env.USUARBD,process.env.PASSBD,{
    host: "localhost",
    dialect:"mysql"
})

module.exports = connection;