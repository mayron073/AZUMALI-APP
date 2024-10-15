import { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [ usuarios, setUsuarios] = useState([]);
  const { getUsers, users } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsuarios(data);
    }
    fetchUsers();
  }, []);

  return (
    <>
      <NavBar/>
      <div className="admin-panel-container">
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
    </>
  );
};

export default AdminPanel;
