const db = require('../database/connection');
const ModbusRTU = require('modbus-serial');
const client = new ModbusRTU();

const modbusPort = "COM7"; 
const modbusID = 1; 
const baudRate = 9600; 
const dataBits = 8;
const parity = 'none';
const stopBits = 1; 
const datosInsertados = [];


exports.getAllSensorData = (req, res) => {
  const { column, limit } = req.query;

  if (!column) {
    return res.status(400).json({ error: 'La columna no fue especificada' });
  }

  let query = 'SELECT fecha, ?? FROM sensores ORDER BY fecha DESC';
  const queryParams = [column];

  if (limit) {
    query += ' LIMIT ?';
    queryParams.push(parseInt(limit)); // Asegurar que el límite sea un número entero
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error ejecutando la consulta', details: err });
    }

    // No es necesario procesar las fechas, ya que se devolverán en el formato correcto
    res.json(results);
  });
};


// Obtener los nombres de todas las columnas
exports.getColumnNames = (req, res) => {
  const query = 'SHOW COLUMNS FROM sensores';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error ejecutando la consulta', details: err });
    }
    const columnNames = results.map((column) => column.Field);
    res.json(columnNames);
  });
};

// Insertar datos en la base de datos y devolver la fecha
exports.insertSensorData = (data, callback) => {
  const query = 'INSERT INTO sensores (temperatura_ambiente, direccion_viento, velocidad_viento, humedad_relativa, temperatura_interna, radiacion, fecha) VALUES (?,?,?,?,?,?,?)';
  const fechaActual = new Date();
  const values = [
    data.temperatura_ambiente,
    data.direccion_viento,
    data.velocidad_viento,
    data.humedad_relativa,
    data.temperatura_interna,
    data.radiacion,
    fechaActual
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      if (callback) callback(err, null);
    } else {
      console.log('Datos insertados correctamente:', result.insertId);
      if (callback) callback(null, fechaActual); // Devolver la fecha actual a través del callback
    }
  });
};

// Leer datos desde puerto serie usando Modbus y emitirlos a través de socket.io
exports.readSerialData = (io) => {
  client.connectRTUBuffered(modbusPort, { baudRate: baudRate, dataBits: dataBits, parity: parity, stopBits: stopBits }, (err) => {
    if (err) {
      return console.error('Error conectando a Modbus:', err);
    }
    client.setID(modbusID);
    console.log('Conectado al dispositivo Modbus');
  });

  setInterval(() => {
    client.readHoldingRegisters(0, 16, (err, data) => {
      if (err) {
        return console.error('Error leyendo registros Modbus:', err);
      }

      console.log(data);

      const sensorData = {
        temperatura_ambiente: data.data[8] / 10,
        temperatura_interna: data.data[9] / 10,
        humedad_relativa: data.data[12] / 10,
        radiacion: data.data[10],
        velocidad_viento: data.data[0],
        direccion_viento: data.data[11]
      };

      // Insertar datos en la base de datos y emitir al frontend con fecha
      exports.insertSensorData(sensorData, (err, fecha) => {
        if (!err) {
          const dataConFecha = { ...sensorData, fecha }; // Agregar fecha al objeto de datos

          io.emit('sensorData', dataConFecha); // Emitir datos con la fecha al frontend

          console.log('Datos recibidos y enviados:', dataConFecha);
        }
      });
    });
  }, 60000); // Leer cada 60 segundos
};

