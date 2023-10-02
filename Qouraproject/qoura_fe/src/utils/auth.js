import Cookies from 'js-cookie';

// Function to set the CSRF token as a cookie
export const setCsrfToken = (csrfToken) => {
    Cookies.set('csrftoken', csrfToken, { path: '/' });
    Cookies.set('sessionid', sessionId, { path: '/' });
};