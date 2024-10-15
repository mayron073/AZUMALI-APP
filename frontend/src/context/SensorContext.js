import { createContext, useState, useEffect } from "react";
import axios from "axios";

const SensorContext = createContext();

const SensorProvider = ({ children }) => {
  const [sensorDate, setSensorDate] = useState([]);

  const getSensorDate = async (sensor) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`http://localhost:4000/sensores/sensor-date?column=${sensor}`, config);
      setSensorDate(response.data);
      //console.log(response.data);
      
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
