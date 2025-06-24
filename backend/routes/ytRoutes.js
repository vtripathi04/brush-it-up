import express from 'express';
import { handleYoutubeTranscript } from '../controllers/ytController.js';

const router = express.Router();

router.post('/fetch-transcript', handleYoutubeTranscript);

export default router;
