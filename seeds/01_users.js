
exports.seed = knex => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([ // default pass
        { id: 1, username: 'admin', password: 'e3TPs9aSShhRwG3B', scope: 'u', status: 1 } 
      ]);
    });
};
