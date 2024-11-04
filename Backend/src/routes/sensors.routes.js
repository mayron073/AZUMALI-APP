const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensors.controllers');
const authMiddleware  = require('../middlewares/auth.middleware');

// Obtener todos los datos de las columnas "fecha" y cada sensor
router.get('/sensor-date',[authMiddleware], sensorController.getAllSensorData);

// Iniciar lectura de datos a puertos
router.post('/start-reading',[authMiddleware], sensorController.startReadingData);

// Obtener los nombres de todas las columnas
router.get('/sensor-name', [authMiddleware], sensorController.getColumnNames);

// Obtener excel generado
router.get('/export-excel',[authMiddleware], sensorController.exportSensorData);

// Obtener lista de puertos COM
router.get('/com-ports',[authMiddleware], sensorController.listPorts);

module.exports = router;
