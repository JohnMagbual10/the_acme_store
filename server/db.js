const { Client } = require('pg');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

// Create a new instance of the PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/your_database_name'
});

// Connect to the PostgreSQL database
const connect = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

// Method to drop and create the tables for your application and seed data
const init = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id UUID PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE products (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE favorites (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) NOT NULL,
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
      );
    `;

    await client.query(SQL);
    console.log('Tables created successfully');

    // Seeding initial data (if needed)
    // await seedInitialData();

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Function to create a new user
const createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const SQL = `
    INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, hashedPassword]);
  return response.rows[0];
};

// Function to create a new product
const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products (id, name) VALUES ($1, $2) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

// Function to create a new favorite
const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

// Function to fetch users from the database
const fetchUsers = async () => {
  const SQL = `
    SELECT * FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Function to fetch products from the database
const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// Function to fetch favorites for a user from the database
const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * FROM favorites WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

// Function to delete a favorite
const deleteFavorite = async ({ favorite_id }) => {
  const SQL = `
    DELETE FROM favorites WHERE id = $1
  `;
  await client.query(SQL, [favorite_id]);
};

module.exports = {
  client,
  connect,
  init,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  deleteFavorite
};
