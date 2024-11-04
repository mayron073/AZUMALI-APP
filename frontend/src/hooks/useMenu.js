import { useContext } from "react"; // Para extraer los datos
import MenuContext from "../context/MenuContext";

const useMenu = () => {
  return useContext(MenuContext);
};

export default useMenu;