const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS user_skills;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS skills;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE skills(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE user_skills(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      skill_id UUID REFERENCES skills(id) NOT NULL,
      CONSTRAINT unique_user_id_skill_id UNIQUE (user_id, skill_id)
    );
  `;
  await client.query(SQL);

};

module.exports = {
    client
    };