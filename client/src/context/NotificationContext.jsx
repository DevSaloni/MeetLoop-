import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, baseUrl } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${baseUrl}/notifications`, config);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [user, baseUrl]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (user) {
            const newSocket = io(baseUrl.replace('/api', ''), {
                transports: ['websocket']
            });

            newSocket.on('connect', () => {
                newSocket.emit('join', user._id);
            });

            newSocket.on('notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);

                // Play notification sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(e => console.log('Audio play failed:', e));

                toast(notification.title, {
                    icon: notification.type === 'TASK_REMINDER' ? '⚠️' : '🔔',
                    duration: 4000
                });
            });

            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [user, baseUrl]);

    const markAsRead = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${baseUrl}/notifications/${id}/read`, {}, config);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${baseUrl}/notifications/read-all`, {}, config);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
