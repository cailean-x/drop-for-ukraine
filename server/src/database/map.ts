import { Pool } from "pg";

const pool = new Pool({
  user: process.env.MAP_DB_USER,
  host: process.env.MAP_DB_HOST,
  database: process.env.MAP_DB_BASE,
  password: process.env.MAP_DB_PASS,
  port: +process.env.MAP_DB_PORT!,
  max: 30,
});

export default pool;
