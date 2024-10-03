import { useContext } from "react"; // Para extraer los datos
import AuthContext from "../context/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;