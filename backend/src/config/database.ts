import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from './environment';
import * as schema from '../database/schema/index';

const connectionString = config.databaseUrl;
const client = postgres(connectionString, {
  ssl: 'require'
});
export const db = drizzle(client, { schema });