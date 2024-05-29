const express = require('express');
const app = express();
const {
  connect,
  init,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  deleteFavorite
} = require('./db');

// Middleware setup
app.use(express.json());

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:id/favorites', async (req, res, next) => {
  const { id } = req.params;
  try {
    const favorites = await fetchFavorites(id);
    res.send(favorites);
  } catch (error) {
    next(error);
  }
});

app.post('/api/users/:id/favorites', async (req, res, next) => {
  const { id } = req.params;
  const { product_id } = req.body;
  try {
    const favorite = await createFavorite({ user_id: id, product_id });
    res.status(201).send(favorite);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/users/:user_id/favorites/:id', async (req, res, next) => {
  const { user_id, id } = req.params;
  try {
    await deleteFavorite({ user_id, favorite_id: id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server and initialize the database
const startServer = async () => {
  try {
    await connect();
    await init();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();

module.exports = app;
