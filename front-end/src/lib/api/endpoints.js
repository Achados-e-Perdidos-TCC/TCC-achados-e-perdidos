const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/auth/login`, //POST
        register: `${API_BASE_URL}/auth/register`, //POST
        refresh: `${API_BASE_URL}/auth/refresh`, //POST
        logout: `${API_BASE_URL}/auth/logout`, //POST 
        forgotpassword: `${API_BASE_URL}/auth/forgot-password`, //POST
        resetpassword: `${API_BASE_URL}/auth/reset-password` //POST
    }, 
    users: {
        me: `${API_BASE_URL}/users/me`, // GET, DELETE E PATCH
        preferences: `${API_BASE_URL}/users/me/preferences`, // PATCH
        password: `${API_BASE_URL}/users/me/password`, //PATCH
    }, 
    item: {
        items: `${API_BASE_URL}/items`, // POST
        // fazer o resto
    }
}