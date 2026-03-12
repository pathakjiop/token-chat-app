import express from 'express';
import { createRoom, joinRoom, sendMessage, getMessages, deleteRoom } from '../controllers/chatController.js';

const router = express.Router();

router.post('/create-room', createRoom);
router.post('/join-room', joinRoom);
router.post('/send-message', sendMessage);
router.get('/messages/:token', getMessages);
router.delete('/room/:token', deleteRoom);

export default router;
