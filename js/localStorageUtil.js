
const TOKEN_KEY = 'authToken';

// Save token to local storage
export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Get token from local storage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Remove token from local storage
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
