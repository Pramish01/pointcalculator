import express from 'express';
import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/pending', protect, adminOnly, getPendingUsers);
router.put('/users/:id/approve', protect, adminOnly, approveUser);
router.put('/users/:id/reject', protect, adminOnly, rejectUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
