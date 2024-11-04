import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useMenu from '../hooks/useMenu';

import '../styles/NavBar.css';
import sena from '../assets/sena.png';

const NavBar = () => {
    const { getUserRole, userRole, logoutUser } = useAuth();
    const { menuOpen, toggleMenu } = useMenu();  
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        getUserRole();
    },[]);

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
                    <details className="dropdown">
                        <summary role="button" className="dropdown-toggle">
                            Herramientas
                        </summary>
                        <ul className="dropdown-menu">
                            <li><Link to="/sensores/settings">Configuración</Link></li>
                            {userRole === 'admin' && (
                                <li><Link to="/sensores/admin-panel">Administrador</Link></li>
                            )}
                            <li><Link to="/" onClick={logoutUser}>Cerrar sesión</Link></li>
                        </ul>
                    </details>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;


