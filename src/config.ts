import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

export const NODE_ENV = getEnvVar('NODE_ENV', false) || 'development';
export const PORT = Number(getEnvVar('PORT', false) || '3000');

export const SECRET_KEY = getEnvVar('SECRET_KEY');
export const REFRESH_SECRET_KEY = getEnvVar('REFRESH_SECRET_KEY');

export const DB_CONFIG = {
  host: getEnvVar('DB_HOST'),
  port: Number(getEnvVar('DB_PORT')),
  database: getEnvVar('DB_NAME'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
};
