export const ENV = {
  APP_NAME: 'Home2School Admin Dashboard',
  APP_VERSION: '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;
