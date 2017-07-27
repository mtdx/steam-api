
exports.seed = knex => {
  return knex('steam_errors').del()
    .then(() => {
      return knex('steam_errors').insert([
        { 
          code: 400, 
          error: 'Error Name', 
          message: 'Error Message', 
          steam_account_name: 'csgoninjastorage64'
        },
        { 
          code: 400, 
          error: 'Error Name', 
          message: 'Error Message', 
          steam_account_name: 'csgoninjastorage71'
        }
      ]);
    });
};
