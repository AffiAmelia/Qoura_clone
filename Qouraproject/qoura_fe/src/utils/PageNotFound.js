import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="container text-center margin-top">
            <h1>404 - Page Not Found</h1>
            <p>The requested page could not be found.</p>
            <Link to="/" className="btn btn-primary">
                Go Back
            </Link>
        </div>
    );
};

export default PageNotFound;