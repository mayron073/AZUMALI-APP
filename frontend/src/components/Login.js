import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth } = useAuth();
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('http://localhost:4000/usuarios/login', {username, password});
            localStorage.setItem('token', data.token);
            console.log(data);
            setAuth(data);
            history('/sensores');

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className="login-container">
            <h2>Ingresar</h2>
            <form className="login-form" onSubmit={handleSubmit}>
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
                <button type="submit">iniciar sesion</button>
                <Link to='/registro'>¿No tienes una cuenta?</Link>
            </form>
        </div>
    );
};

export default Login;

