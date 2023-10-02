import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, isLoggedIn, ...rest }) => {
    if (isLoggedIn) {
        return <Route element={<Element />} {...rest} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
