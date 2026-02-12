import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Set default authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Fetch user profile
                    const response = await axios.get(`${API_URL}/auth/me`);
                    setUser(response.data.user);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Register new user
    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/register`, userData);

            const { token, user } = response.data;

            // Save token
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return { success: true, user };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const { token, user } = response.data;

            // Save token
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return { success: true, user };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Google Login
    const googleLogin = async (idToken) => {
        try {
            setError(null);
            const response = await axios.post(`${API_URL}/auth/google`, {
                idToken,
            });

            const { token, user } = response.data;

            // Save token
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return { success: true, user };
        } catch (err) {
            const message = err.response?.data?.message || 'Google login failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Clear local state regardless of API response
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setError(null);
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setError(null);
            const response = await axios.put(`${API_URL}/auth/profile`, profileData);

            setUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (err) {
            const message = err.response?.data?.message || 'Profile update failed';
            setError(message);
            return { success: false, message };
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            setUser(response.data.user);
            return response.data.user;
        } catch (err) {
            console.error('Failed to refresh user:', err);
            return null;
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        googleLogin,
        logout,
        updateProfile,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
