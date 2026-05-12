import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE,
});

client.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

export default client;