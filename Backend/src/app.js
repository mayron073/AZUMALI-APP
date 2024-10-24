require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
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

app.use(cors({
  origin: 'http://192.168.1.65:3000',  // Debe coincidir con la URL de tu frontend
  methods: ['GET', 'POST'],
  credentials: true,
}));
//app.use(cors());

const server = http.createServer(app);

app.use('/usuarios', authRoutes);

app.use('/sensores', [authMiddleware], sensorRoutes);


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: 'http://192.168.1.65:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ["my-custom-header"], // Puedes añadir más si lo necesitas
  },
});

// Leer datos desde puerto serie y enviar en tiempo real
sensorController.readSerialData(io);