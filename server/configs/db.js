import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

client
  .connect()
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.error("error connecting to db", err);
  });

export default client;
