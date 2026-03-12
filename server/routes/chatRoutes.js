import express from 'express';
import { createRoom, joinRoom, sendMessage, getMessages, leaveRoom, deleteRoom } from '../controllers/chatController.js';

const router = express.Router();

router.post('/create-room', createRoom);
router.post('/join-room', joinRoom);
router.post('/send-message', sendMessage);
router.get('/messages/:token', getMessages);
router.post('/leave-room', leaveRoom);
router.delete('/room/:token', deleteRoom);

export default router;

