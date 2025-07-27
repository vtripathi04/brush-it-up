import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { QuestionCard } from "./QuestionCard";
import { Box, Typography, Button, Container, CircularProgress, Alert, Experimental_CssVarsProvider } from '@mui/material';

export function QuizPage() {
    const location = useLocation();
    const quizText = location.state?.quizText;

    const [questions, setQuestions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState(null);
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

                    // set user answers for mcqs and one word answers as empty arrays of respective sizes
                    // console.log(response.data.data.mcqs);
                    // console.log( "MCQ size: ", response.data.data.mcqs.length );
                    // console.log( "One Word size: ", response.data.data.oneWord.length );
                    
                    setUserAnswers(
                    { 
                        mcqs: new Array( response.data.data.mcqs.length ).fill(""),
                        oneWord: new Array( response.data.data.oneWord.length ).fill(""),
                    } );

                    console.log(userAnswers);

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


    const handleAnswerChange = ( qType, index, answer ) => {
        
        setUserAnswers( prevUserAnswers => {

            const newUserAnswers = {...prevUserAnswers};
            newUserAnswers[qType][index] = answer;
            return newUserAnswers;

        } );

        console.log(userAnswers);
        
       
    }



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
                        questionType="mcqs"
                        options={mcq.options}
                        value={ userAnswers["mcqs"][index] }
                        onAnswerChange = {(answer) => handleAnswerChange( "mcqs", index, answer ) }
                    />
                ))}

                {/* --- Render Short Answer Questions --- */}
                {questions?.oneWord?.map((shortAnswer, index) => (
                    <QuestionCard
                        key={`short-answer-${index}`}
                        // continue the numbering from where the MCQs left off
                        questionNumber={(questions?.mcqs?.length || 0) + index + 1}
                        questionText={shortAnswer.question}
                        questionType="oneWord"
                        // no need to pass options, the component handles it
                        value={ userAnswers["oneWord"][index] }
                        onAnswerChange = {(answer) => handleAnswerChange( "oneWord", index, answer ) }
                        
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