const express = require('express');
const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);      
router.get('/users', [authMiddleware], authController.getUsers);

module.exports = router;

