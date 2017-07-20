
exports.seed = knex => {
  return knex('groups').del()
    .then(function () {
      return knex('groups').insert([
        { group_link: 'csgofast', user_id: 1 },
        { group_link: 'gostrongcom', user_id: 1 },
      ]);
    });
};
