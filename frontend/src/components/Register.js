import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthForms.css';
import logo from '../assets/logo.jpg'
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = await axios.post('http://192.168.1.65:4000/usuarios/register', {
                username, 
                password,
                role
            });

            if (data.status === 201) {
                history('/');
            } else {
                console.error('Error al registrar');
            }
        } catch (error) {
            console.error('Error en la solicitud de registro:', error);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className='img-container'>
                    <img src={logo} alt='img fondo' className='img-logo'></img>
                </div>
                <h2>Registro</h2>
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <label>Rol</label>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <button type="submit">Registrar</button>
                <Link to='/'>Regresar</Link>
            </form>
        </div>
    );
};

export default Register;

