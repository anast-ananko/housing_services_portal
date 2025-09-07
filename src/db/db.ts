import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

(async () => {
  try {
    await client.connect();
    console.log(`Connected to database ${process.env.DB_NAME}`);
  } catch (err) {
    console.error('Failed to connect to database', err);
  }
})();

export default client;
