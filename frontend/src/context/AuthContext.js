import { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [ authToken, setAuthToken ] = useState(null);
    const [ userRole, setUserRole ] = useState(null);
    const [ auth, setAuth ] = useState({});
    const [ users, setUsers ] = useState([]);

    const loginUser = async (username, password) => {
        const response = await fetch('/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            setAuth(data);
            setAuthToken(data.token);
            setUserRole(data.role);
            
            return true;
        } else {
            return false;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setAuth({});
    };

    const getUserRole = () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
            //return decodedToken.role;
        }
        return null;
    };

    const getUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
      
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
      
            const response = await axios.get('http://192.168.1.65:4000/usuarios/users', config);
            setUsers(response.data);
            console.log(response.data);
            return response.data;
            
          } catch (error) {
            console.log(error);
          }
    };

    return (
        <AuthContext.Provider value={{ 
            loginUser, 
            logoutUser,
            getUsers,
            users, 
            authToken, 
            getUserRole,
            userRole, 
            auth, 
            setAuth
             }}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthProvider
};

export default AuthContext;
