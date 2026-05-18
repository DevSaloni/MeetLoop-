import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (rawUrl && !rawUrl.endsWith('/api') && !rawUrl.endsWith('/api/')) {
        rawUrl = rawUrl.endsWith('/') ? `${rawUrl}api` : `${rawUrl}/api`;
    }
    const baseUrl = rawUrl;

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, baseUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
