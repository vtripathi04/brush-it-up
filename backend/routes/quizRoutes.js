import express from 'express';
import { generateQuizFromText } from '../controllers/quizController.js';

const router = express.Router();

router.post('/generate_quiz', generateQuizFromText);

export default router;
