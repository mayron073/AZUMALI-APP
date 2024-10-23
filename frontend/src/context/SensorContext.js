import { createContext, useState, useEffect } from "react";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const SensorContext = createContext();

const SensorProvider = ({ children }) => {
  const [sensorDate, setSensorDate] = useState([]);

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
      // Definir los parámetros de consulta
      const queryParams = new URLSearchParams();
      queryParams.append('column', sensor);
      queryParams.append('limit', limit); // Límite de datos para hora, diario o mes

      // Solicitud GET a la ruta '/sensor-date'
      const response = await axios.get(`http://192.168.1.65:4000/sensores/sensor-date?${queryParams.toString()}`, config);
      setSensorDate(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SensorContext.Provider
      value={{
        sensorDate,
        setSensorDate,
        getSensorDate,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export { SensorProvider };
export default SensorContext;
