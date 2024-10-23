require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const sensorRoutes = require('./routes/sensors.routes');
const authRoutes = require('./routes/auth.routes');
const sensorController = require('./controllers/sensors.controllers');
const authMiddleware  = require('./middlewares/auth.middleware');

//console.log("JWT Secret:", process.env.JWT_SECRET);
const PORT = process.env.PORT || 5000;
const IP = process.env.LOCAL_IP;

const app = express();
app.use(express.json());

app.use(cors());

const server = http.createServer(app);
//const io = socketIO(server)

const io = socketIO(server, {
  cors: {
    origin: 'http://192.168.1.65:3000',  // Permitir conexiones desde el frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use('/usuarios', authRoutes);

app.use('/sensores', [authMiddleware], sensorRoutes);

// Leer datos desde puerto serie y enviar en tiempo real
sensorController.readSerialData(io);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});
