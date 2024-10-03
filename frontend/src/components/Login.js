import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth } = useAuth();
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post('http://localhost:4000/usuarios/login', {username, password});

            localStorage.getItem('token', data.token);
            console.log(data);
            setAuth(data);
            history('/Dashboard');

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div>
            <h2>Ingresar</h2>
            <form onSubmit={handleSubmit}>
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
                <Link to='/resister'>¿No tienes una cuenta?</Link>
            </form>
        </div>
    );
};

export default Login;

