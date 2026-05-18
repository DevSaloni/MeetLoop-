import Notification from '../models/Notification.js';
import { io } from '../index.js';
import User from '../models/User.js';

export const sendNotification = async ({ recipient, sender, type, title, message, link }) => {
    try {
        // Check user preferences before sending
        const user = await User.findById(recipient).select('preferences');
        if (user && user.preferences && user.preferences.emailNotifications === false) {
            console.log(`Notification skipped for ${recipient} due to preferences.`);
            return null; // Don't send if notifications are turned off
        }

        const notification = new Notification({
            recipient,
            sender,
            type,
            title,
            message,
            link
        });

        await notification.save();

        // Emit to the recipient's private socket room
        if (io) {
            io.to(recipient.toString()).emit('notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('Error sending real-time notification:', error);
    }
};
