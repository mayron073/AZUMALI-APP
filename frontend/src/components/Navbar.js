import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/NavBar.css';

const NavBar = () => {
    const { userRole, getUserRole, logoutUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    //const role = getUserRole();
    useEffect(() => {
        getUserRole();
    }, []);

    // Función para alternar la visibilidad del dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <h3>Variables del clima</h3>
            <ul className="nav-links">
                <li>
                    <Link to="/sensores/temperature">Temperatura Ambiente</Link>
                </li>
                <li>
                    <Link to="/sensores/internal-temperature">Temperatura Interna</Link>
                </li>
                <li>
                    <Link to="/sensores/humidity">Humedad Relativa</Link>
                </li>
                <li>
                    <Link to="/sensores/radiation">Radiación</Link>
                </li>
                <li>
                    <Link to="/sensores/wind-speed">Velocidad del Viento</Link>
                </li>
                <li>
                    <Link to="/sensores/wind-direction">Dirección del Viento</Link>
                </li>

                <li>
                    {/* Dropdown de Herramientas */}
                    <div className="dropdown">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            Herramientas
                        </button>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/sensores/settings">Configuración</Link>
                                </li>
                                {userRole === 'admin' && (
                                    <>
                                        <li>
                                            <Link to="/sensores/admin-panel">Administrador</Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <button>
                                        <Link to="/" onClick={logoutUser}>Cerrar Sesión</Link>
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
