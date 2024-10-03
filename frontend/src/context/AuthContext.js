import { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const loginUser = async (username, password) => {
        const response = await fetch('/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            setAuthToken(data.token);
            setUserRole(data.role);
            return true;
        } else {
            return false;
        }
    };

    const logoutUser = () => {
        setAuthToken(null);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ loginUser, logoutUser, authToken, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthProvider
};

export default AuthContext;
