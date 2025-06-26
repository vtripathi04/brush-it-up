import express from 'express';
import { generateQuizFromText } from '../controllers/quizController.js';

const router = express.Router();

router.post('/generate', generateQuizFromText);

export default router;
