import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthForms.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const data = await axios.post('http://192.168.1.58:4000/usuarios/register', {
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
            <h2>Registro</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
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
            </form>
        </div>
    );
};

export default Register;

