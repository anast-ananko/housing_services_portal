import { Client } from 'pg';
import { DB_CONFIG } from '../config';

const client = new Client(DB_CONFIG);

(async () => {
  try {
    await client.connect();
    console.log(`Connected to database ${DB_CONFIG.database}`);
  } catch (err) {
    console.error('Failed to connect to database', err);
  }
})();

export default client;
