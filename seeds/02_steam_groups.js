
exports.seed = knex => {
  return knex('steam_groups').del()
    .then(function () {
      return knex('steam_groups').insert([
        { group_link: 'csgofast', user_id: 1 },
        { group_link: 'gostrongcom', user_id: 1 },
      ]);
    });
};
