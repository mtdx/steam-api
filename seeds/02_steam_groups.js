
exports.seed = knex => {
  return knex('steam_groups').del()
    .then(() => {
      return knex('steam_groups').insert([
        { status: 1, group_link: 'csgofast', user_id: 1 },
        { status: 1, group_link: 'gostrongcom', user_id: 1 }
      ]);
    });
};
