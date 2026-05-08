import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => {
    console.log("Postgres connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting DB ", err);
  });

export default client;
