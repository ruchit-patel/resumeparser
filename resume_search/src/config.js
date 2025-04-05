// Load configuration from site_config.json or environment variables
export const config = {
    backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
};
