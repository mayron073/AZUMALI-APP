require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

const sensorRoutes = require('./routes/sensors.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware  = require('./middlewares/auth.middleware');

const PORT = process.env.PORT || 5000;
const IP = process.env.LOCAL_IP;

const app = express();
app.use(express.json());

app.use(cors({
  origin: `http://${IP}:3000`,  // Debe coincidir con la URL de tu frontend
  methods: ['GET', 'POST'],
  credentials: true,
}));

const server = http.createServer(app);

app.use('/usuarios', authRoutes);

app.use('/sensores', [authMiddleware], sensorRoutes);


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: `http://${IP}:3000`,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  },
});

app.set('io', io);
