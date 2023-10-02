import { useState, useEffect } from 'react';

const useCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('/api/get-csrf-token/', {
                    credentials: 'include', // Include cookies with the request
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    return csrfToken;
};

export default useCsrfToken;