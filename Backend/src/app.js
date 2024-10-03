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

/* Se utiliza para realizar la comunicacion entre el servidor del frontend y el backend
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};
app.use(cors(corsOptions));
*/
app.use(cors());


app.use('/usuarios', authRoutes);

app.use('/sensores', [authMiddleware], sensorRoutes);

// Leer datos desde puerto serie y enviar en tiempo real
//sensorController.readSerialData(io);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
