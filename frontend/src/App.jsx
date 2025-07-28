import React from 'react';
import { Routes, Route, Outlet, ScrollRestoration } from 'react-router-dom';


// render the current page (Outlet) and provide scroll restoration.
const App = () => {
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
}

export default App;