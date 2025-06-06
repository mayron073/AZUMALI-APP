/*import React from 'react';
import SensorGraph from '../components/SensorGraph.js';
import NavBar from '../components/Navbar.js';

const Dashboard = () => {
  return (
    <div>
      {<NavBar />}
    </div>
  );
};

export default Dashboard;
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import FloatingMenu from '../components/FloatingMenu';
import MapComponent from '../components/MapComponent';
import '../styles/Dashboard.css';
import estacion from '../assets/estacion.jpg';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const socket = io(backendUrl, {
  transports: ['websocket'],
  withCredentials: true,
});

const sensorInfo = [
  { name: 'Temperatura Ambiente (°c)', key: 'temperatura_ambiente', path: 'temperature' },
  { name: 'Temperatura Interna (°c)', key: 'temperatura_interna', path: 'internal-temperature' },
  { name: 'Humedad Relativa (%)', key: 'humedad_relativa', path: 'humidity' },
  { name: 'Radiación (W/m²)', key: 'radiacion', path: 'radiation' },
  { name: 'Velocidad del Viento (m/s)', key: 'velocidad_viento', path: 'wind-speed' },
  { name: 'Dirección del Viento (N = 0°)', key: 'direccion_viento', path: 'wind-direction' },
];

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({});
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    socket.on('sensorData', (newData) => {
      setSensorData((prev) => ({ ...prev, ...newData }));
    });

    return () => {
      socket.off('sensorData');
    };
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header-info">
        <img src={estacion} alt="estacion" className="img" />
        <div className="header-text">
          <h1>Estación Meteorológica 1</h1>
          <p>Esta aplicación web permite la monitorización en tiempo real de variables climáticas mediante el uso de sensores conectados a un controlador de comunicacion serial. la aplicacion recolecta datos cada 60 segundos de sensores de temperatura ambiente, temperatura interna, humedad relativa, radiación solar, velocidad y dirección del viento. Estos datos se almacenan en una base de datos MySQL y se visualizan a través de gráficas interactivas en el frontend utilizando tecnologías como React y Chart.js.</p>
        </div>
        <div>
          <MapComponent/>
        </div>
      </div>

      <div className="sensor-grid">
        {sensorInfo.map((sensor) => (
          <div
            key={sensor.key}
            className="sensor-card"
            onClick={() => navigate(`/sensores/${sensor.path}`)}
          >
            <h3>{sensor.name}</h3>
            <p className="sensor-value">
              {sensorData[sensor.key] !== undefined ? sensorData[sensor.key] : '...'}
            </p>
            <h6>Ver grafica</h6>
          </div>
        ))}
      </div>

      <button className="floating-home-btn" onClick={() => navigate('/sensores')}>
        🏠
      </button>
      <button
        className="floating-menu-btn"
        onClick={() => setMenuVisible(!menuVisible)}
        title="Menú"
      >
        ⚙️
      </button>

      <FloatingMenu visible={menuVisible} />
    </div>
  );
};

export default Dashboard;
