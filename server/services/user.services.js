import client from "../configs/db.js";

const createUserService = async (data) => {
  const { name, email } = data;

  const query = 'INSERT INTO "User" (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];

  const result = await client.query(query, values);
  return result.rows[0];
};

export default { createUserService };
