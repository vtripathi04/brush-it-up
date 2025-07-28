import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './features/quiz/components/LandingPage';
import { QuizInput } from './features/quiz/components/QuizInput';
import { QuizPage } from './features/quiz/components/QuizPage';
import { ResultPage } from './features/quiz/components/ResultPage';


const App = () => {
    return (
        <Routes>
            <Route path='/' element={ <LandingPage/> } />
            <Route path='/quizInput' element={ <QuizInput/> } />
            <Route path='/quizPage' element={ <QuizPage/> } />
            <Route path='/quizResult' element={ <ResultPage/> } />
        </Routes>
    );
}

export default App;