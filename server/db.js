const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');

const bcrypt = require('bcrypt');
const uuid = require('uuid');

// Database Schema:
// users table:
//   id (UUID) PRIMARY KEY
//   username (VARCHAR(20)) NOT NULL UNIQUE
//   password (VARCHAR(255)) NOT NULL

// products table:
//   id (UUID) PRIMARY KEY
//   name (VARCHAR(100)) NOT NULL UNIQUE

// favorites table:
//   id (UUID) PRIMARY KEY
//   user_id (UUID) REFERENCES users(id) NOT NULL
//   product_id (UUID) REFERENCES products(id) NOT NULL
//   CONSTRAINT unique_user_id_product_id UNIQUE (user_id, product_id)

// user_favorites table:
//   id (UUID) PRIMARY KEY
//   user_id (UUID) REFERENCES users(id) NOT NULL
//   favorite_id (UUID) REFERENCES favorites(id) NOT NULL
//   CONSTRAINT unique_user_id_favorite_id UNIQUE (user_id, favorite_id)

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS user_favorites;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users (
      id UUID PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE
    );

    CREATE TABLE favorites (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      CONSTRAINT unique_user_id_product_id UNIQUE (user_id, product_id)
    );

    CREATE TABLE user_favorites (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      favorite_id UUID REFERENCES favorites(id) NOT NULL,
      CONSTRAINT unique_user_id_favorite_id UNIQUE (user_id, favorite_id)
    );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const SQL = `
    INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, hashedPassword]);
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products (id, name) VALUES ($1, $2) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT * FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * FROM favorites
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const destroyFavorite = async ({ user_id, favorite_id }) => {
  const SQL = `
    DELETE FROM favorites
    WHERE user_id = $1 AND id = $2
  `;
  await client.query(SQL, [user_id, favorite_id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  destroyFavorite
};
