import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RutaProtegida = () => {

  const { auth, cargando } = useAuth();
  console.log(auth);

  if (cargando) return "cargando...";

  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
  
};

export default RutaProtegida;