const fetchAPI = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = token;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+endpoint, options);
        if(response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Not authorized');
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
};

export default fetchAPI;