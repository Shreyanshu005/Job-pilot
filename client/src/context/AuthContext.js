'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('jobpilot_token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch {
            localStorage.removeItem('jobpilot_token');
        }
        setLoading(false);
    };

    const login = async (identifier, password) => {
        const res = await api.post('/auth/login', { identifier, password });
        localStorage.setItem('jobpilot_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const signup = async (data) => {
        const res = await api.post('/auth/signup', data);
        localStorage.setItem('jobpilot_token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('jobpilot_token');
        setUser(null);
        window.location.href = '/login';
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
