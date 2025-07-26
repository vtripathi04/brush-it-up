import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { QuestionCard } from "./QuestionCard";
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';

export function QuizPage() {
    const location = useLocation();
    const quizText = location.state?.quizText;

    const [questions, setQuestions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // only run the fetch function if quizText exists
        if (!quizText) {
            setError("No text was provided to generate a quiz. Please go back and provide a source.");
            setIsLoading(false);
            return;
        }

        const fetchQuestions = async () => {
            try {
                const endpoint = "http://localhost:5000/api/quiz/generate_quiz";
                // The backend expects the text to be inside a 'data' object, then a 'text' object
                // the body should be { data: { text: quizText } }
                const response = await axios.post(endpoint, {
                    data: { text: quizText }
                });

                // check if the expected data structure exists
                if (response.data && response.data.data) {
                    setQuestions(response.data.data);
                } else {
                    throw new Error("Received an unexpected data format from the server.");
                }

            } catch (err) {
                console.error('Error fetching questions:', err);
                setError("Sorry, we couldn't generate the quiz. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();

    }, [quizText]);


    // render a loading spinner while fetching data
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Generating your quiz...</Typography>
            </Box>
        );
    }

    // render an error message if something went wrong
    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // render the quiz questions once data is successfully loaded
    return (
        <Box sx={{ py: 5, backgroundColor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 5, fontWeight: 'bold' }}>
                    Here's Your Quiz!
                </Typography>

                {/* --- Render MCQs --- */}
                {questions?.mcqs?.map((mcq, index) => (
                    <QuestionCard
                        key={`mcq-${index}`}
                        questionNumber={index + 1}
                        questionText={mcq.question}
                        questionType="mcq"
                        options={mcq.options}
                    />
                ))}

                {/* --- Render Short Answer Questions --- */}
                {questions?.oneWord?.map((shortAnswer, index) => (
                    <QuestionCard
                        key={`short-answer-${index}`}
                        // continue the numbering from where the MCQs left off
                        questionNumber={(questions?.mcqs?.length || 0) + index + 1}
                        questionText={shortAnswer.question}
                        questionType="short_answer"
                        // no need to pass options, the component handles it
                    />
                ))}

                <Box textAlign="center" mt={5}>
                    <Button variant="contained" size="large">
                        Submit Quiz
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}