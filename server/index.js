//server/index.js
const { fetchUsers } = require('../../../../B35GP/acme_talent_agency/Server/db');
const {
    client,
    createTables,
    createUser,
    createFavorites,
    createUserFavorites,
    fetchUsers,
    fetchFavorites,
    fetchUserFavorites
  } = require('./db');
  
  const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, singing, dancing, juggling, plateSpinning] = await Promise.all([
      createUser({ username: 'moe', password: 's3cr3t' }),
      createUser({ username: 'lucy', password: 's3cr3t!!' }),
      createUser({ username: 'ethyl', password: 'shhh' }),
      createFavorites({ name: 'singing'}),
      createFavorites({ name: 'dancing'}),
      createFavorites({ name: 'juggling'}),
      createFavorites({ name: 'plate spinning'}),
    ]);
    const users = await fetchUsers();
    console.log(users);
  
    const Favorites = await fetchFavorites();
    console.log(Favorites);
  
    const userFavorites = await Promise.all([
      createUserFavorites({ user_id: moe.id, favorites_id: plateSpinning.id}),
      createUserFavorites({ user_id: moe.id, favorites_id: juggling.id}),
      createUserFavorites({ user_id: ethyl.id, favorites_id: juggling.id}),
      createUserFavorites({ user_id: lucy.id, favorites_id: dancing.id}),
    ]);
  
    console.log(await fetchUserFavorites(moe.id));
    await deleteUserFavorites(userFavorites[0].id);
    console.log (await fetchUserFavorites(moe.id));
  };
  
  init();

             