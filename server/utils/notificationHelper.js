import Notification from '../models/Notification.js';
import { io } from '../index.js';

export const sendNotification = async ({ recipient, sender, type, title, message, link }) => {
    try {
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
