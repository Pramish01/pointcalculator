import express from 'express';
import {
  createTeam,
  getTeams,
  searchTeams,
  getTeamById,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createTeam)
  .get(protect, getTeams);

router.get('/search', protect, searchTeams);

router.route('/:id')
  .get(protect, getTeamById)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

export default router;
