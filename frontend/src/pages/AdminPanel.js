import { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
import useSensor from '../hooks/useSensor';

import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [ usuarios, setUsuarios] = useState([]);
  const { getUsers } = useAuth();
  const { comPorts, fetchComPorts, startReadingData } = useSensor();
  const [ selectedPort, setSelectedPort ] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsuarios(data);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchComPorts(); // Llamar a la función para obtener los puertos al montar el componente
  }, [fetchComPorts]);

  const handlePortChange = (event) => {
    setSelectedPort(event.target.value);
  };

  const handleConnect = (e) => {
    e.preventDefault();
    
    if (selectedPort) {
      startReadingData(selectedPort);
    } else {
      console.error("Seleccione un puerto antes de conectar");
    }
  };

  return (
    <>
      <NavBar />
      <div className="admin-panel-container">
        <div className="config-section">
          <h2>Puerto para comunicación serial con estación</h2>
          <select value={selectedPort} onChange={handlePortChange}>
            <option value="">Seleccione un puerto COM</option>
            {comPorts.map((port) => (
              <option key={port.path} value={port.path}>
                {port.path}
              </option>
            ))}
          </select>
          <div>
            <h2>Conectar estación meteorológica</h2>
          </div>
          <button className="connect-button" onClick={handleConnect}>Conectar</button>
        </div>
        
        <div className="table-section">
          <h2>Tabla de usuarios</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
  
};

export default AdminPanel;

