import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client'; 
import useSensor from '../hooks/useSensor';
import NavBar from './Navbar';
import '../styles/SensorGraph.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io('http://192.168.1.58:4000' ,{
  transports: ['websocket'],  
  withCredentials: true,
});

const sensorUnits = {
  temperatura_ambiente: '°C',
  temperatura_interna: '°C',
  humedad_relativa: '%',
  radiacion: 'W/m²',
  velocidad_viento: 'm/s',
  direccion_viento: 'Grados N = 0'
};

const SensorGraph = ({ sensor = 'temperatura_ambiente' }) => {
  const [column, setColumn] = useState('');
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const { getSensorDate, sensorDate } = useSensor();
  const [filter, setFilter] = useState('hora');
  const [ text, setText ] = useState('');

  // Función para obtener el número de datos según el filtro seleccionado
  const getLimitByFilter = (filter) => {
    switch (filter) {
      case 'hora':
        return 60; // Últimos 60 datos (cada 60 segundos = 1 hora)
      case 'diario':
        return 1440; // Últimos 1440 datos (uno por cada minuto durante 24 horas)
      case 'mes':
        return 43200; // Últimos 43200 datos (uno por cada minuto durante 30 días)
      default:
        return 60; // Por defecto, mostrar los datos de la última hora
    }
  };

  const filterDataByTime = (sensorDate, filter) => {
    switch (filter) {
      case 'diario':
        // Filtrar para obtener un dato por cada hora (1440 datos -> 24 datos)
        return sensorDate.filter((item, index) => index % 60 === 0);
      case 'mes':
        // Filtrar para obtener un dato por cada día (43200 datos -> 30 datos)
        return sensorDate.filter((item, index) => index % 1440 === 0);
      default:
        // Para la opción "hora" devolvemos todos los datos
        return sensorDate;
    }
  };

  useEffect(() => {
    const limit = getLimitByFilter(filter); 
    getSensorDate(sensor, limit);
    setColumn(sensor);
    
    if (filter === 'hora')
      setText('a hora');
    if (filter === 'diario')
      setText('os dias');
    if (filter === 'mes')
      setText('os meses');

  }, [sensor, filter]); // Ejecutar al cambiar el sensor o el filtro seleccionado

  useEffect(() => {
    if (Array.isArray(sensorDate)) {
      const filteredData = filterDataByTime(sensorDate, filter);

      const dates = filteredData.map((item) => item.fecha);
      const sensorValues = filteredData.map((item) => item[sensor]);

      setLabels(dates);
      setData(sensorValues);
    }
  }, [sensorDate, sensor, filter]);

  useEffect(() => {
    socket.on('sensorData', (newData) => {
      if (newData[column]) {
        setLabels((prevLabels) => [...prevLabels, new Date().toLocaleString()]);
        setData((prevData) => [...prevData, newData[column]]);
      }
    });

    return () => {
      socket.off('sensorData');
    };
  }, [column]);

  const unit = sensorUnits[sensor] || '';

  // Opciones para la gráfica
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `${column} (${unit})`,
        data: data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${column} (${unit}) ultim${text} `,
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="App">
        {/* Botones para seleccionar el filtro */}
        <div className="filter-buttons">
          <button onClick={() => setFilter('hora')}>Hora</button>
          <button onClick={() => setFilter('diario')}>Diario</button>
          <button onClick={() => setFilter('mes')}>Mes</button>
        </div>

        {/* Componente gráfico de línea */}
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </>
  );
};

export default SensorGraph;
