// src/components/FloatingMenu.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useSensor from '../hooks/useSensor';
import '../styles/NavBar.css';

const FloatingMenu = ({ visible }) => {
  const { getUserRole, userRole, logoutUser } = useAuth();
  const { handleExportExcel } = useSensor();

  useEffect(() => {
    getUserRole();
  }, []);

  if (!visible) return null;

  return (
    <div className="dropdown-menu" style={{ position: 'fixed', top: '70px', right: '10px' }}>
      <li>
        <button onClick={handleExportExcel} className="dropdown-button">
          Excel log
        </button>
      </li>
      {userRole === 'admin' && (
        <li>
          <Link to="/sensores/admin-panel">Administrador</Link>
        </li>
      )}
      <li>
        <Link to="/" onClick={logoutUser}>Cerrar sesión</Link>
      </li>
    </div>
  );
};

export default FloatingMenu;
