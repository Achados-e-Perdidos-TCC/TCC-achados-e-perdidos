const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`, //POST
    register: `${API_BASE_URL}/auth/register`, //POST
    refresh: `${API_BASE_URL}/auth/refresh`, //POST
    logout: `${API_BASE_URL}/auth/logout`, //POST
    forgotpassword: `${API_BASE_URL}/auth/forgot-password`, //POST
    resetpassword: `${API_BASE_URL}/auth/reset-password`, //POST
  },
  users: {
    me: `${API_BASE_URL}/users/me`, // GET, DELETE E PATCH
    preferences: `${API_BASE_URL}/users/me/preferences`, // PATCH
    password: `${API_BASE_URL}/users/me/password`, //PATCH
  },
  item: {
    register: `${API_BASE_URL}/items`, // POST
    search: `${API_BASE_URL}/items/search`, // GET
    find: (id) => `${API_BASE_URL}/items/${id}`, //GET
    me: `${API_BASE_URL}/items/me`, //GET
    // fazer o resto
  },
  notification: {
    get: `${API_BASE_URL}/notifications`,
    readAll: `${API_BASE_URL}/notifications/read-all`,
    read: (id) => `${API_BASE_URL}/notifications/${id}/read`,
  },
  category: {
    findAll: `${API_BASE_URL}/categories`,
  },
  uploads: `${API_BASE_URL}/uploads/images`,
};
