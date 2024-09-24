const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sensorRoutes = require('./routes/sensors.routes');
const sensorController = require('./controllers/sensors.controllers');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/', sensorRoutes);

// Socket.IO para enviar datos en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Leer datos desde puerto serie y enviarlos en tiempo real
sensorController.readSerialData(io);

// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
