import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
// import appStore from './appStore.js';
import CssBaseline from '@mui/material/CssBaseline'; 
import App from './App.jsx';
import theme from './theme.js';

// importing components
import { LandingPage } from './features/quiz/components/LandingPage';
import { QuizInput } from './features/quiz/components/QuizInput';
import { QuizPage } from './features/quiz/components/QuizPage';
import { ResultPage } from './features/quiz/components/ResultPage';


// defining routes
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/quizInput',
        element: <QuizInput />,
      },
      {
        path: '/quizPage',
        element: <QuizPage />,
      },
      {
        path: '/quizResult',
        element: <ResultPage />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Provider store = {appStore} > */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    {/* </Provider> */}
  </React.StrictMode>,
);