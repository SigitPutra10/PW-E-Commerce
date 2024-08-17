import { Sequelize } from "sequelize";

const db = new Sequelize('db_ecommerce','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;
