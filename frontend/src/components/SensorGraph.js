import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client'; 

import useSensor from '../hooks/useSensor';
import NavBar from './Navbar';

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

const socket = io('http://localhost:3000');

const SensorGraph = ({sensor = 'temperatura_ambiente'}) => {
  const [column, setColumn] = useState('');
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const { getSensorDate, sensorDate } = useSensor();

  useEffect(() => {    
    getSensorDate(sensor);
    setColumn(sensor);
  }, [sensor]);

  useEffect(() => {
    if (Array.isArray(sensorDate)) {
      const dates = sensorDate.map((item) => item.fecha);
      const sensorValues = sensorDate.map((item) => item[sensor]);
      setLabels(dates);
      setData(sensorValues);
    }
  }, [sensorDate, sensor]);

  useEffect(() => {
    socket.on('sensorData', (newData) => {
      // Actualizar los datos del sensor seleccionado en tiempo real
      if (newData[column]) {
        setLabels((prevLabels) => [...prevLabels, new Date().toLocaleString()]);
        setData((prevData) => [...prevData, newData[column]]);
      }
    });

    // Desconectar el socket al desmontar el componente
    return () => {
      socket.off('sensorData');
    };
  }, [column]); // Volver a llamar a la API y escuchar el socket cuando se cambie el sensor


  // Opciones para la gráfica
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Valores de ${column}`,
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
        text: `Gráfica de ${column} con respecto a la fecha`,
      },
    },
  };

  return (
    <>
      <NavBar />
      <div className="App">
        {/* Componente gráfico de línea */}
        <div style={{ width: '80%', margin: 'auto', padding: '20px' }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </>

  );
};

export default SensorGraph;
