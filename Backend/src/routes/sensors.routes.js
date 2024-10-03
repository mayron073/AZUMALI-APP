const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensors.controllers');

// Obtener todos los datos de las columnas "fecha" y cada sensor
router.get('/sensor-date', sensorController.getAllSensorData);

// Obtener los nombres de todas las columnas
router.get('/sensor-name', sensorController.getColumnNames);

module.exports = router;
