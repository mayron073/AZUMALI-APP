const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'proof1',       
    password: 'Mm1007901Mm', 
    database: 'weather_station'  
  });

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = db;
