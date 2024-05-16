//server/index.js
const { fetchUsers } = require('../../../../B35GP/acme_talent_agency/Server/db');
const {
    client,
    createTables,
    createUser,
    createFavorites,
    fetchUsers,
    fetchFavorites
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

  const skills = await fetchFavorites();
  console.log(Favorites);
  
  };
  
  init();

             