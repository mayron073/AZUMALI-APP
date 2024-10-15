const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensors.controllers');
const authMiddleware  = require('../middlewares/auth.middleware');

// Obtener todos los datos de las columnas "fecha" y cada sensor
router.get('/sensor-date', [authMiddleware], sensorController.getAllSensorData);

// Obtener los nombres de todas las columnas
router.get('/sensor-name', [authMiddleware], sensorController.getColumnNames);

module.exports = router;
