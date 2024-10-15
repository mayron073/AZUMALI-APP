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
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.use(cors());

const server = http.createServer(app);
const io = socketIO(server)

app.use('/usuarios', authRoutes);

app.use('/sensores', [authMiddleware], sensorRoutes);

// Leer datos desde puerto serie y enviar en tiempo real
sensorController.readSerialData(io);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
