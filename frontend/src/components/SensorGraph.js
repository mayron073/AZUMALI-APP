import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import io from 'socket.io-client'; // Importar socket.io-client
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

const socket = io('http://localhost:3000'); // Conectar con el servidor WebSocket

const SensorGraph = () => {
  const [sensorData, setSensorData] = useState([]);
  const [column, setColumn] = useState('temperatura_ambiente'); // Columna por defecto para mostrar en la gráfica
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  // Función para obtener los datos iniciales del sensor desde la API
  const fetchSensorData = async (selectedColumn) => {
    try {
      const response = await axios.get(`http://localhost:3000/sensor?column=${selectedColumn}`);
      const fetchedData = response.data;

      const dates = fetchedData.map((item) => item.fecha);
      const sensorValues = fetchedData.map((item) => item[selectedColumn]);

      setLabels(dates);
      setData(sensorValues);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  useEffect(() => {
    // Llamar a la API cuando el componente se monta para obtener datos iniciales
    fetchSensorData(column);

    // Configurar la escucha de eventos para recibir datos en tiempo real desde el servidor WebSocket
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
    <div className="App">
      <h1>Gráfica de Sensores</h1>

      {/* Botones para seleccionar qué sensor mostrar */}
      <div>
        <button onClick={() => setColumn('temperatura_ambiente')}>Temperatura Ambiente</button>
        <button onClick={() => setColumn('temperatura_interna')}>Temperatura Interna</button>
        <button onClick={() => setColumn('humedad_relativa')}>Humedad Relativa</button>
        <button onClick={() => setColumn('radiacion')}>Radiación</button>
        <button onClick={() => setColumn('velocidad_viento')}>Velocidad Viento</button>
        <button onClick={() => setColumn('direccion_viento')}>Dirección Viento</button>
      </div>

      {/* Componente gráfico de línea */}
      <div style={{ width: '80%', margin: 'auto', padding: '20px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SensorGraph;
