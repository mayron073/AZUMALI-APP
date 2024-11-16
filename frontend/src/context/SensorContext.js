import { createContext, useState } from "react";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SensorContext = createContext();

const SensorProvider = ({ children }) => {
  const [sensorDate, setSensorDate] = useState([]);
  const [comPorts, setComPorts] = useState([]); // Estado para almacenar los puertos COM

  const getSensorDate = async (sensor, limit) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const queryParams = new URLSearchParams();
      queryParams.append('column', sensor);
      queryParams.append('limit', limit);

      const response = await axios.get(`${backendUrl}/sensores/sensor-date?${queryParams.toString()}`, config);
      setSensorDate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const startReadingData = async (puerto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Pasa un objeto vacío como cuerpo de la solicitud, luego config
      await axios.post(`${backendUrl}/sensores/start-reading`, {puerto}, config);
      console.log('Lectura de datos iniciada');

    } catch (error) {
      console.error('Error en la conexión:', error);
    }
  };


  // función para exportar a Excel
  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'  // Importante para recibir el archivo
      };

      const response = await axios.get(`${backendUrl}/sensores/export-excel`, config);

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sensor_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('Error al descargar el archivo Excel', error);
    }
  };

  const fetchComPorts = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${backendUrl}/sensores/com-ports`, config);
      setComPorts(response.data);
      
    } catch (error) {
      console.error("Error al obtener la lista de puertos COM:", error);
    }
  };

  return (
    <SensorContext.Provider
      value={{
        sensorDate,
        comPorts,
        setSensorDate,
        getSensorDate,
        startReadingData,
        handleExportExcel,
        fetchComPorts,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export { SensorProvider };
export default SensorContext;

