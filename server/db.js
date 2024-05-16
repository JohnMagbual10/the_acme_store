const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async()=> {
    //not shown
  };
  
  const createUser = async({ username, password })=> {
    const SQL = `
      INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  }
  
  const createFavorites = async({ name })=> {
    const SQL = `
      INSERT INTO Favorites(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  }

  const fetchUsers = async()=> {
    const SQL = `
      SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }
  
  const fetchFavorites = async()=> {
    const SQL = `
      SELECT * FROM skills;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }
  
  
  
  module.exports = {
    client,
    createTables,
    createUser,
    createSkill,
    fetchUsers,
    fetchFavorites
  };