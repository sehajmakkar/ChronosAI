import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to load user data using the token
    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch user profile
            const response = await axios.get('/users/profile');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error loading user:', error);
            localStorage.removeItem('token'); // Clear invalid token
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    // Load user data on mount and token change
    useEffect(() => {
        loadUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, loadUser }}>
            {!loading && children}
        </UserContext.Provider>
    );
};