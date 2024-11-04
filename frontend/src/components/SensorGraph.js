import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client'; 
import useSensor from '../hooks/useSensor';
import useMenu from '../hooks/useMenu';
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

const socket = io('http://192.168.1.65:4000' ,{
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
  const { menuOpen } = useMenu();
  const chartRef = useRef(null); // Referencia para la gráfica

  // Función para obtener el número de datos según el filtro seleccionado
  const getLimitByFilter = (filter) => {
    switch (filter) {
      case 'hora':
        return 60; 
      case 'diario':
        return 1440; 
      case 'mes':
        return 43200; 
      default:
        return 60; 
    }
  };

  const filterDataByTime = (sensorDate, filter) => {
    switch (filter) {
      case 'diario':
        return sensorDate.filter((item, index) => index % 60 === 0);
      case 'mes':
        return sensorDate.filter((item, index) => index % 1440 === 0);
      default:
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
  }, [sensor, filter]);

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
      console.log(newData);

      if (newData) {
        setLabels((prevLabels) => [new Date(newData.fecha).toLocaleString(), ...prevLabels]);
        setData((prevData) => [newData[column], ...prevData]);

        console.log(column);
        console.log(labels);
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
    maintainAspectRatio: false, // Permite que la gráfica se ajuste dinámicamente
    plugins: {
      legend: {
        position: 'top',
        display: window.innerWidth > 600, // Ocultar leyenda en pantallas pequeñas
      },
      title: {
        display: true,
        text: `${column} (${unit}) ultim${text} `,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 12, // Ajuste de tamaño en pantallas pequeñas
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 12, // Ajuste de tamaño en pantallas pequeñas
          }
        }
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="App">
        {/* Condicional para mostrar u ocultar los botones de filtro */}
        {!menuOpen && (
          <div className="filter-buttons">
            <button onClick={() => setFilter('hora')}>Hora</button>
            <button onClick={() => setFilter('diario')}>Diario</button>
            <button onClick={() => setFilter('mes')}>Mes</button>
          </div>
        )}
        <div className="chart-container">
          <Line data={chartData} options={options} ref={chartRef} />
        </div>
      </div>
    </>
  );
};

export default SensorGraph;

