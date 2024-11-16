const express = require('express');
const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', authController.register);
// Ruta para iniciar sesion
router.post('/login', authController.login);      
// Ruta para obtener todos los usuarios
router.get('/users', [authMiddleware], authController.getUsers);

module.exports = router;

