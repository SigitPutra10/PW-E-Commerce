const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Sesuaikan dengan username database Anda
  password: '', // Sesuaikan dengan password database Anda
  database: 'db_ecommerce' // Sesuaikan dengan nama database Anda
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
