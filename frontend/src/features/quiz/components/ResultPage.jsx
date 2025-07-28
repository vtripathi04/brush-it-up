import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { ResultCard } from "./ResultCard"; // Import our new component
import { Box, Typography, Button, Container, CircularProgress, Alert, Paper } from '@mui/material';

export function ResultPage() {
    const location = useLocation();
    const questions = location.state?.questions;
    const userAnswers = location.state?.userAnswers;

    const [evaluation, setEvaluation] = useState(null);

    useEffect(() => {
        if (!questions || !userAnswers) {
            return;
        }

        setEvaluation({
            mcqs: userAnswers.mcqs.map((ans, index) => ans === questions.mcqs[index].answer),
            oneWord: userAnswers.oneWord.map((ans, index) => ans === questions.oneWord[index].answer),
        });
    }, [questions, userAnswers]);

    // calculate the final score using useMemo for efficiency
    const finalScore = useMemo(() => {
        if (!evaluation) return { correct: 0, total: 0 };

        const correctMcqs = evaluation.mcqs.filter(Boolean).length;
        const correctOneWord = evaluation.oneWord.filter(Boolean).length;
        const totalMcqs = evaluation.mcqs.length;
        const totalOneWord = evaluation.oneWord.length;

        return {
            correct: correctMcqs + correctOneWord,
            total: totalMcqs + totalOneWord,
        };
    }, [evaluation]);


    // render a loading state until the evaluation is complete
    if (!evaluation) {
        // also handle the case where the user navigates here directly
        if (!questions || !userAnswers) {
            return (
                <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                    <Alert severity="error">Quiz data not found. Please start a new quiz.</Alert>
                    <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
                        Back to Start
                    </Button>
                </Container>
            );
        }
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 5, backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Quiz Results
                </Typography>

                {/* Score Summary Card */}
                <Paper elevation={3} sx={{ p: 3, mb: 5, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h5">Your Final Score</Typography>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', my: 1 }}>
                        {finalScore.correct} / {finalScore.total}
                    </Typography>
                </Paper>

                {/* --- Render MCQ Results --- */}
                {questions.mcqs.map((mcq, index) => (
                    <ResultCard
                        key={`mcq-result-${index}`}
                        questionNumber={index + 1}
                        questionText={mcq.question}
                        userAnswer={userAnswers.mcqs[index]}
                        correctAnswer={mcq.answer}
                        explanation={mcq.explanation}
                        isCorrect={evaluation.mcqs[index]}
                    />
                ))}

                {/* --- Render Short Answer Results --- */}
                {questions.oneWord.map((shortAnswer, index) => (
                    <ResultCard
                        key={`one-word-result-${index}`}
                        questionNumber={questions.mcqs.length + index + 1}
                        questionText={shortAnswer.question}
                        userAnswer={userAnswers.oneWord[index]}
                        correctAnswer={shortAnswer.answer}
                        explanation={shortAnswer.explanation}
                        isCorrect={evaluation.oneWord[index]}
                    />
                ))}

                 <Box textAlign="center" mt={5}>
                    <Button component={Link} to="/" variant="contained" size="large">
                        Create Another Quiz
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}