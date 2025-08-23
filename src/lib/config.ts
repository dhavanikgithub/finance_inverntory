// Determine schema based on environment
export const getSchema = () => {
    const env = process.env.PROJECT_ENVIRONMENT || 'staging';
    return env;
};
