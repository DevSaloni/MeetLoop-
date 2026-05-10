import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createTeam,
    joinTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    removeMember,
    leaveTeam,
    regenerateInviteCode,
    deleteTeam,
    sendInviteEmail
} from '../controllers/teamController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
    .get(getMyTeams)       // GET  /api/teams       → list my teams
    .post(createTeam);     // POST /api/teams       → create a team

router.post('/join', joinTeam);  // POST /api/teams/join  → join via invite code

router.route('/:id')
    .get(getTeamById)      // GET    /api/teams/:id  → get team details
    .put(updateTeam)       // PUT    /api/teams/:id  → update team info
    .delete(deleteTeam);   // DELETE /api/teams/:id  → delete team

router.delete('/:id/members/:userId', removeMember);  // Remove a member
router.delete('/:id/leave', leaveTeam);                // Leave a team
router.put('/:id/regenerate-code', regenerateInviteCode); // New invite code
router.post('/:id/invite', sendInviteEmail); // Send invite email

export default router;
