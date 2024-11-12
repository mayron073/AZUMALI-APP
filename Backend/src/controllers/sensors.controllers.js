const db = require('../database/connection');
const ModbusRTU = require('modbus-serial');
const client = new ModbusRTU();
const ExcelJS = require('exceljs');
const { exec } = require('child_process');

//const modbusPort = 'COM7'; 
const modbusID = 1; 
const baudRate = 9600; 
const dataBits = 8;
const parity = 'none';
const stopBits = 1; 


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

// Iniciar lectura de datos
exports.startReadingData = (req, res) => {
  const { puerto } = req.body; // Extrae el puerto de la solicitud
  const io = req.app.get('io'); // Accede a io para WebSocket

  if (!puerto) {
    return res.status(400).json({ error: 'El puerto es obligatorio.' });
  }

  // Llama a readSerialData y pasa puerto e io como argumentos
  exports.readSerialData({ puerto, io });
  res.status(200).json({ message: 'Lectura de datos iniciada' });
};

// Leer datos desde puerto serie usando Modbus y emitirlos a través de socket.io
exports.readSerialData = ({puerto, io}) => {
  client.connectRTUBuffered(puerto, { baudRate: baudRate, dataBits: dataBits, parity: parity, stopBits: stopBits }, (err) => {
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


exports.exportSensorData = (req, res) => {
  try {
      const query = 'SELECT * FROM sensores';

      db.query(query, async (err, rows) => {
          if (err) {
              console.error("Error ejecutando la consulta:", err);
              return res.status(500).json({ error: 'Error ejecutando la consulta', details: err });
          }

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Sensores Data');

          // Definir encabezados
          worksheet.columns = [
              { header: 'ID', key: 'id', width: 10 },
              { header: 'Temperatura Ambiente (°C)', key: 'temperatura_ambiente', width: 20 },
              { header: 'Temperatura Interna (°C)', key: 'temperatura_interna', width: 20 },
              { header: 'Humedad Relativa (%)', key: 'humedad_relativa', width: 20 },
              { header: 'Radiación (W/m²)', key: 'radiacion', width: 15 },
              { header: 'Velocidad Viento (m/s)', key: 'velocidad_viento', width: 20 },
              { header: 'Dirección Viento (Grados)', key: 'direccion_viento', width: 25 },
              { header: 'Fecha', key: 'fecha', width: 20 }
          ];

          // Añadir filas con los datos obtenidos de la consulta
          rows.forEach(row => worksheet.addRow(row));

          // Configurar las cabeceras para la respuesta
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename="sensor_data.xlsx"');

          // Escribir el archivo Excel en la respuesta y finalizar
          await workbook.xlsx.write(res);
          res.status(200).end();
      });
  } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      res.status(500).json({ message: 'Error al generar el archivo Excel' });
  }
};

exports.listPorts = (req, res) => {
    exec('serialport-list -f json', (error, stdout, stderr) => {
        if (error) {
            console.error("Error al listar los puertos:", error);
            return res.status(500).json({ error: "Error al listar los puertos" });
        }
        if (stderr) {
            console.error("Error en la salida:", stderr);
            return res.status(500).json({ error: "Error en la salida de la lista de puertos" });
        }
        
        // Parseamos la salida en JSON
        try {
            const ports = JSON.parse(stdout);
            res.json(ports); // Enviamos la lista de puertos como respuesta JSON
        } catch (parseError) {
            console.error("Error al parsear la salida JSON:", parseError);
            res.status(500).json({ error: "Error al parsear la salida JSON" });
        }
    });
};







