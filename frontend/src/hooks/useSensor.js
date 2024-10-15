import { useContext } from "react"; // Para extraer los datos
import SensorContext from "../context/SensorContext";

const useSensor = () => {
  return useContext(SensorContext);
};

export default useSensor;