import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/misc', miscRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('MeetLoop API is running...');
});

// Socket.io connection logic
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
  });
});

// Export io for controllers
export { io };

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
