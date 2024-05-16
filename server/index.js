const express = require('express');
const app = express();
const { createTables, createUser, createProduct, createFavorite, fetchUsers, fetchProducts, fetchFavorites, destroyFavorite, createUserFavorites, fetchUserFavorites, deleteUserFavorites } = require('./db');

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.send(products);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/favorites', async (req, res, next) => {
  try {
    const favorites = await fetchFavorites(req.params.id);
    res.send(favorites);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/userFavorites', async (req, res, next) => {
  try {
    const userFavorites = await fetchUserFavorites(req.params.id);
    res.send(userFavorites);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:id/userFavorites', async (req, res, next) => {
  try {
    const newFavorite = await createUserFavorites({ user_id: req.params.id, favorites_id: req.body.favorites_id });
    res.status(201).send(newFavorite);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/userFavorites/:id', async (req, res, next) => {
  try {
    await deleteUserFavorites({ id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await createTables();
  console.log('Tables created');

  const [moe, lucy, ethyl, singing, dancing, juggling, plateSpinning] = await Promise.all([
    createUser({ username: 'moe', password: 's3cr3t' }),
    createUser({ username: 'lucy', password: 's3cr3t!!' }),
    createUser({ username: 'ethyl', password: 'shhh' }),
    createProduct({ name: 'singing' }),
    createProduct({ name: 'dancing' }),
    createProduct({ name: 'juggling' }),
    createProduct({ name: 'plate spinning' }),
  ]);

  const userFavorites = await Promise.all([
    createFavorite({ user_id: moe.id, product_id: plateSpinning.id }),
    createFavorite({ user_id: moe.id, product_id: juggling.id }),
    createFavorite({ user_id: ethyl.id, product_id: juggling.id }),
    createFavorite({ user_id: lucy.id, product_id: dancing.id }),
  ]);

  console.log('User favorites created:', userFavorites);

  const users = await fetchUsers();
  console.log('Users:', users);

  const favorites = await fetchFavorites();
  console.log('Favorites:', favorites);

  const userFavoritesData = await fetchUserFavorites(moe.id);
  console.log('User favorites:', userFavoritesData);

  await deleteUserFavorites(userFavorites[0].id);
  console.log('User favorites after deletion:', await fetchUserFavorites(moe.id));
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

init();
