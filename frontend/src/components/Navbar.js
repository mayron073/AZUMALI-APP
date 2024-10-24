import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/NavBar.css';
import sena from '../assets/sena.png';

const NavBar = () => {
    const { userRole, getUserRole, logoutUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        getUserRole();
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Función para alternar el menú hamburguesa
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <img src={sena} alt='sena-logo' className='img' />
            
            {/* Botón de hamburguesa para pantallas pequeñas */}
            <button className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* Enlaces de navegación, mostrar/ocultar según el estado del menú */}
            <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li><Link to="/sensores/temperature">Temperatura Ambiente</Link></li>
                <li><Link to="/sensores/internal-temperature">Temperatura Interna</Link></li>
                <li><Link to="/sensores/humidity">Humedad Relativa</Link></li>
                <li><Link to="/sensores/radiation">Radiación</Link></li>
                <li><Link to="/sensores/wind-speed">Velocidad del Viento</Link></li>
                <li><Link to="/sensores/wind-direction">Dirección del Viento</Link></li>
                <li>
                    <div className="dropdown">
                        <button onClick={toggleDropdown} className="dropdown-toggle">
                            Herramientas
                        </button>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/sensores/settings">Configuración</Link></li>
                                {userRole === 'admin' && (
                                    <li><Link to="/sensores/admin-panel">Administrador</Link></li>
                                )}
                                <li><Link to="/" onClick={logoutUser}>Cerrar Sesión</Link></li>
                            </ul>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
