import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createMeeting,
    getMyMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting,
    reExtractTasks,
    updateTaskStatus,
    getMyTasks
} from '../controllers/meetingController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/meetings          → get all meetings for user's teams
// POST /api/meetings         → create a new meeting (Team Lead only)
router.route('/')
    .get(getMyMeetings)
    .post(createMeeting);

// GET /api/meetings/my-tasks → get all tasks assigned to current user
router.get('/my-tasks', getMyTasks);

// GET /api/meetings/:id      → get single meeting
// PUT /api/meetings/:id      → update meeting
// DELETE /api/meetings/:id   → delete meeting
router.route('/:id')
    .get(getMeetingById)
    .put(updateMeeting)
    .delete(deleteMeeting);

// POST /api/meetings/:id/extract → re-run AI extraction
router.post('/:id/extract', reExtractTasks);

// PUT /api/meetings/:id/tasks/:taskId → update a task's status/details
router.put('/:id/tasks/:taskId', updateTaskStatus);

export default router;
