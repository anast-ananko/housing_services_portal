import client from './db';
import { readFile } from 'fs/promises';
import path from 'path';

export async function initDatabase() {
  try {
    await client.connect();

    const dropTablesSQL = await readFile(path.join(__dirname, 'drop_tables.sql'), 'utf-8');
    await client.query(dropTablesSQL);

    const typesSQL = await readFile(path.join(__dirname, 'types.sql'), 'utf-8');
    await client.query(typesSQL);
   
    const tablesSQL = await readFile(path.join(__dirname, 'tables.sql'), 'utf-8');
    await client.query(tablesSQL);

    const indexesSQL = await readFile(path.join(__dirname, 'indexes.sql'), 'utf-8');
    await client.query(indexesSQL);

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.end();
  }
}
