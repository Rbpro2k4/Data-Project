const config = {
    get apiUrl() {
        // Try to get URL from localStorage, fallback to localhost for development
        return localStorage.getItem('apiUrl') || 'http://localhost:5000';
    },
    setApiUrl(url) {
        // Validate URL format
        try {
            new URL(url);
            localStorage.setItem('apiUrl', url);
            return true;
        } catch (e) {
            console.error('Invalid URL format');
            return false;
        }
    }
};
