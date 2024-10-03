import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SensorList({ onSelectSensor }) {
  const [columns, setColumns] = useState([]);

  // Obtener los nombres de las columnas al montar el componente
  useEffect(() => {
    const fetchColumnNames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/inicio');
        setColumns(response.data);
      } catch (error) {
        console.error('Error fetching column names:', error);
      }
    };

    fetchColumnNames();
  }, []);

  return (
    <div>
      <h2>Sensores Disponibles</h2>
      {/* Mostrar un botón por cada columna */}
      {columns.map((column, index) => (
        <button key={index} onClick={() => onSelectSensor(column)}>
          {column}
        </button>
      ))}
    </div>
  );
}

export default SensorList;
