import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav>
      <a href="/dashboard">Home</a>
      {user && user.role === 'admin' && (
        <>
          <a href="/users">Usuarios</a>
          <a href="/settings">Configuración</a>
        </>
      )}
    </nav>
  );
};

export default Navbar;

